import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
import { Response } from 'express';
import { accessTokenOptions, refreshTokenOptions } from '../../models/constants/token-options.const';
import { secureCookieOptions } from '../../models/constants/cookie-options.const';

@Injectable()
export class AuthenticationService {

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
    ) {}

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

    async loginUser(userPayload: UserPayloadParams, res: Response): Promise<UserPayloadParams> {
        const jwtTokens: JwtTokensParams = {
            accessToken: await this.generateAccessToken(userPayload),
            refreshToken: await this.generateRefreshToken(userPayload),
        };

        if (jwtTokens.accessToken) await this.storeTokenInCookie(res, jwtTokens.accessToken, secureCookieOptions);
        if (jwtTokens.refreshToken) {
            await this.storeTokenInCookie(res, jwtTokens.refreshToken, secureCookieOptions);
            await this.usersService.updateRefreshToken(userPayload.uuid, jwtTokens.refreshToken.value);
        }

        return (userPayload);
    }

    /* User validation: used in strategies. */
    
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

    private async generateAccessToken(userPayload: UserPayloadParams): Promise<JwtTokenParams> {
        const accessToken: JwtTokenParams = {
            name: JwtTokenEnum.ACCESS,
            value: await this.jwtService.signAsync(userPayload, accessTokenOptions(this.configService)),
            expiresIn: new Date(),
        };

        try {
            const tokenPayload: any = await this.jwtService.verifyAsync(accessToken.value, accessTokenOptions(this.configService));
            accessToken.expiresIn = new Date(tokenPayload.exp * 1000);
        } catch(error) {
            throw new UnauthorizedException('Invalid JWT token received. It might have been tinkered with.');
        }

        return (accessToken);
    }

    private async generateRefreshToken(userPayload: UserPayloadParams): Promise<JwtTokenParams> {
        const refreshToken: JwtTokenParams = {
            name: JwtTokenEnum.REFRESH,
            value: await this.jwtService.signAsync(userPayload, refreshTokenOptions(this.configService)),
            expiresIn: new Date(),
        };

        try {
            const tokenPayload: any = await this.jwtService.verifyAsync(refreshToken.value, refreshTokenOptions(this.configService));
            refreshToken.expiresIn = new Date(tokenPayload.exp * 1000);
        } catch(error) {
            throw new UnauthorizedException('Invalid JWT token received. It might have been tinkered with.');
        }

        return (refreshToken);
    }

    async storeTokenInCookie(res: Response, token: JwtTokenParams, options?: any): Promise<void> {
        res.cookie(token.name, token.value, {
            ...options,
            expires: token.expiresIn,
        });
    }

    async refreshAccessToken(userPayload: UserPayloadParams, res: Response): Promise<UserPayloadParams> {
        const accessToken: JwtTokenParams = await this.generateAccessToken(userPayload);

        await this.storeTokenInCookie(res, accessToken, secureCookieOptions);
        return (userPayload);
    }
    
}
