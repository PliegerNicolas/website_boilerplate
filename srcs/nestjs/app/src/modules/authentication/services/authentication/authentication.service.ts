import { HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users/users.service';
import { HashingService } from 'src/utils/hashing/services/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { UserPayloadParams } from '../../models/types/jwt/payloads.type';
import { LocalLoginParams } from '../../models/types/local/local-login.type';
import { User } from 'src/modules/users/entities/user.entity';
import { LocalRegisterParams } from '../../models/types/local/local-register.type';
import { GoogleRegisterParams } from '../../models/types/google/google-register.type';
import { JwtTokenParams, JwtTokensParams } from '../../models/types/jwt/tokens.type';
import { JwtTokenEnum } from '../../models/enums/jwt-tokens.enum';
import { Request, Response } from 'express';
import { accessTokenOptions, refreshTokenOptions } from '../../models/constants/token-options.const';
import { jwtTokenCookieOptions, secureCookieOptions } from '../../models/constants/cookie-options.const';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AuthenticationService {

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    /* Registration */

    async registerLocalUser(userDetails: LocalRegisterParams): Promise<UserPayloadParams> {
        userDetails.password = await this.hashingService.hash(userDetails.password);
        const user: User = await this.usersService.createUser(userDetails);

        const userPayload: UserPayloadParams = {
            uuid: user.uuid,
            username: user.username,
            role: user.role,
        };

        return (userPayload);
    }

    async registerGoogleUser(googleUserDetails: GoogleRegisterParams): Promise<UserPayloadParams> {
        const user: User = await this.usersService.createUser(googleUserDetails);

        const googleUserPayload: UserPayloadParams = {
            uuid: user.uuid,
            username: user.username,
            role: user.role,
        }

        return (googleUserPayload);
    }

    /* Login */

    async loginUser(userPayload: UserPayloadParams, res: Response): Promise<UserPayloadParams> {
        const jwtTokens: JwtTokensParams = {
            accessToken: await this.generateAccessToken(userPayload),
            refreshToken: await this.generateRefreshToken(userPayload),
        };

        const refreshTokenExp: number = this.jwtService.decode(jwtTokens.refreshToken!.value).exp;
        const tokenCookieOptions: any = jwtTokenCookieOptions(new Date(refreshTokenExp * 1000));

        await this.storeTokenInCookie(res, jwtTokens.accessToken!, tokenCookieOptions);
        await this.storeTokenInCookie(res, jwtTokens.refreshToken!, tokenCookieOptions);
        await this.usersService.updateRefreshToken(userPayload.uuid, jwtTokens.refreshToken!.value);

        return (userPayload);
    }

    /* Loggout */

    async invalidateAndClearJwtTokensFromCookies(req: Request, res: Response): Promise<void> {
        const accessToken: string = req.cookies['access_token'];
        const refreshToken: string = req.cookies['refresh_token'];

        if (!accessToken && !refreshToken) throw new UnauthorizedException('Not authenticated');

        if (accessToken) {
            try {
                const decodedAccessToken: any = await this.jwtService.verify(accessToken, accessTokenOptions(this.configService));
                const ttl: number = decodedAccessToken.exp - Math.floor(Date.now() / 1000);
                await this.cacheManager.set(`jwt_blacklist:${accessToken}`, true, ttl);
                //res.clearCookie('access_token');
            } catch(error) {
                console.error(error);
            }
        }

        if (refreshToken) {
            try {
                const decodedRefreshToken: any = await this.jwtService.verify(refreshToken, refreshTokenOptions(this.configService));
                const ttl: number = decodedRefreshToken.exp - Math.floor(Date.now() / 1000);
                await this.cacheManager.set(`jwt_blacklist:${refreshToken}`, true, ttl);
                res.clearCookie('refresh_token');
            } catch(error) {
                console.error(error);
            }
        }
    }

    /* User validation: used in passport strategies. */
    
    async validateLocalUser(userDetails: LocalLoginParams): Promise<UserPayloadParams | null> {
        const user: User | null = await this.usersService.findUserByUsername(userDetails.username);

        if (!user || !await this.hashingService.compare(user.password, userDetails.password)) {
            return (null);
        }

        const userPayload: UserPayloadParams = {
            uuid: user.uuid,
            username: user.username,
            role: user.role,
        };

        return (userPayload);
    }

    async validateGoogleUser(googleUserDetails: GoogleRegisterParams): Promise<UserPayloadParams | null> {
        const user: User | null = await this.usersService.findUserByEmail(googleUserDetails.email);

        if (!user) return (null);

        const userPayload: UserPayloadParams = {
            uuid: user.uuid,
            username: user.username,
            role: user.role,
        };

        return (userPayload);
    }

    /* JWT tokens */

    async storeTokenInCookie(res: Response, token: JwtTokenParams, options?: any): Promise<void> {
        res.cookie(token.name, token.value, {
            ...options,
        });
    }

    async isJwtTokenBlacklisted(token: string): Promise<boolean> {
        return (!!await this.cacheManager.get(`jwt_blacklist:${token}`));
    }

    private async generateAccessToken(userPayload: UserPayloadParams): Promise<JwtTokenParams> {
        const accessToken: JwtTokenParams = {
            name: JwtTokenEnum.ACCESS,
            value: await this.jwtService.signAsync(userPayload, accessTokenOptions(this.configService)),
        };

        return (accessToken);
    }

    private async generateRefreshToken(userPayload: UserPayloadParams): Promise<JwtTokenParams> {
        const refreshToken: JwtTokenParams = {
            name: JwtTokenEnum.REFRESH,
            value: await this.jwtService.signAsync(userPayload, refreshTokenOptions(this.configService)),
        };

        return (refreshToken);
    }

    async refreshAccessToken(userPayload: UserPayloadParams, req: Request, res: Response): Promise<UserPayloadParams> {
        const refreshToken: string = req.cookies['refresh_token'];
        if (!refreshToken) throw new UnauthorizedException('No refresh token found.'); // TODO.

        try {
            const refreshTokenExp: number = (await this.jwtService.verifyAsync(refreshToken, refreshTokenOptions(this.configService))).exp;
            const tokenCookieOptions: any = jwtTokenCookieOptions(new Date(refreshTokenExp * 1000));

            const accessToken: JwtTokenParams = await this.generateAccessToken(userPayload);
            await this.storeTokenInCookie(res, accessToken, tokenCookieOptions);

            return (userPayload);
        } catch(error) {
            throw new UnauthorizedException(); // TODO.
        }
    }
    
}
