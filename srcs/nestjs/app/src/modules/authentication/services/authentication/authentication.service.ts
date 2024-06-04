import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users/users.service';
import { HashingService } from 'src/utils/hashing/services/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { UserPayloadParams } from '../../models/types/jwt/payloads.type';
import { LocalLoginParams, LocalRegisterAndMethodParams, LocalRegisterParams } from '../../models/types/local/local.type';
import { User } from 'src/modules/users/entities/user.entity';
import { GoogleRegisterParams } from '../../models/types/google/google-register.type';
import { JwtTokenParams, JwtTokensParams } from '../../models/types/jwt/tokens.type';
import { JwtTokenEnum } from '../../models/enums/jwt-tokens.enum';
import { Request, Response } from 'express';
import { accessTokenOptions, refreshTokenOptions } from '../../models/constants/token-options.const';
import { jwtTokenCookieOptions } from '../../models/constants/cookie-options.const';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RegistrationProvider } from 'src/modules/users/models/enums/registration-provider.enum';
import { RegistrationMethod } from 'src/modules/users/entities/registration-method.entity';

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

        const userDetailsAndMethod: LocalRegisterAndMethodParams = {
            email: userDetails.email,
            username: userDetails.username,
            registrationMethod: {
                provider: RegistrationProvider.LOCAL,
                identifier: userDetails.password,
            },
        };

        const user: User = await this.usersService.createUser(userDetailsAndMethod);

        const userPayload: UserPayloadParams = {
            uuid: user.uuid,
            username: user.username,
            serverRole: user.serverRole,
        };

        return (userPayload);
    }

    async registerGoogleUser(googleUserDetails: GoogleRegisterParams): Promise<UserPayloadParams> {
        googleUserDetails.googleId = await this.hashingService.hash(googleUserDetails.googleId);

        const googleUserDetailsAndMethod: LocalRegisterAndMethodParams = {
            email: googleUserDetails.email,
            username: googleUserDetails.username,
            registrationMethod: {
                provider: RegistrationProvider.GOOGLE_OAUTH2,
                identifier: googleUserDetails.googleId,
            },
        };
        
        const user: User = await this.usersService.createUser(googleUserDetailsAndMethod);

        const googleUserPayload: UserPayloadParams = {
            uuid: user.uuid,
            username: user.username,
            serverRole: user.serverRole,
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
                res.clearCookie('access_token');
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

        if (!user) return (null);

        if (user.registrationMethod.provider !== RegistrationProvider.LOCAL
            || !await this.hashingService.compare(user.registrationMethod.identifier, userDetails.password)) {
            return (null);
        }

        const userPayload: UserPayloadParams = {
            uuid: user.uuid,
            username: user.username,
            serverRole: user.serverRole,
        };

        return (userPayload);
    }

    async validateGoogleUser(googleUserDetails: GoogleRegisterParams): Promise<UserPayloadParams | null> {
        const user: User | null = await this.usersService.findUserByEmail(googleUserDetails.email);

        if (!user) return (null);

        if (user.registrationMethod.provider !== RegistrationProvider.GOOGLE_OAUTH2
            || !await this.hashingService.compare(user.registrationMethod.identifier, googleUserDetails.googleId)) {
            return (null);
        }

        const userPayload: UserPayloadParams = {
            uuid: user.uuid,
            username: user.username,
            serverRole: user.serverRole,
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
