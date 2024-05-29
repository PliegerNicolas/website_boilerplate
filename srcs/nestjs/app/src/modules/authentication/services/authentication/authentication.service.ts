import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users/users.service';
import { HashingService } from 'src/utils/hashing/services/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { UserPayloadParams } from '../../models/types/jwt/payloads.type';
import { LocalLoginParams } from '../../models/types/local/local-login.type';
import { GoogleLoginParams } from '../../models/types/google/google-login.type';
import { User } from 'src/modules/users/entities/user.entity';
import { LocalRegisterParams } from '../../models/types/local/local-register.type';
import { GoogleRegisterParams } from '../../models/types/google/google-register.type';
import { JwtTokenParams, JwtTokensParams } from '../../models/types/jwt/tokens.type';
import { JwtTokenEnum } from '../../models/enums/jwt-tokens.enum';
import { Response } from 'express';

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
        };

        return (userPayload);
    }

    async loginLocalUser(userDetails: LocalLoginParams, res: Response): Promise<UserPayloadParams> {
        const user: User | null = await this.usersService.findUserByUsername(userDetails.username);

        if (!user) throw new NotFoundException(`User ${userDetails.username} not found.`);

        const userPayload: UserPayloadParams = {
            uuid: user.uuid,
            username: user.username,
        };

        const jwtTokens: JwtTokensParams = {
            accessToken: await this.generateAccessToken(userPayload),
            refreshToken: await this.generateRefreshToken(userPayload),
        };

        const cookieOptions: any = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            priority: 'high',
        };

        if (jwtTokens.accessToken) this.storeTokenInCookie(res, jwtTokens.accessToken, cookieOptions);
        if (jwtTokens.refreshToken) this.storeTokenInCookie(res, jwtTokens.refreshToken, cookieOptions);

        return (userPayload);
    }

    async registerGoogleUser(userDetails: GoogleRegisterParams) {
        return (null);
    }

    async loginGoogleUser(userDetails: GoogleRegisterParams) {
        return (null);
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
        };

        return (userPayload);
    }

    async validateGoogleUser(userDetails: GoogleLoginParams): Promise<UserPayloadParams | null> {
        // TODO

        return (null);
    }

    /* JWT tokens */

    private async generateAccessToken(userPayload: UserPayloadParams): Promise<JwtTokenParams> {
        const accessTokenOptions: any = {
            secret: this.configService.getOrThrow('jwt.refreshTokenSecret'),
            expiresIn: this.configService.getOrThrow('jwt.refreshTokenExpiration'),
        };

        const accessToken: JwtTokenParams = {
            name: JwtTokenEnum.ACCESS,
            value: await this.jwtService.signAsync(userPayload, accessTokenOptions),
            expiresIn: new Date(),
        };

        try {
            const tokenPayload: any = await this.jwtService.verifyAsync(accessToken.value, accessTokenOptions);
            accessToken.expiresIn = new Date(tokenPayload.exp * 1000);
        } catch(error) {
            throw new UnauthorizedException('Invalid JWT token received.');
        }

        return (accessToken);
    }

    private async generateRefreshToken(userPayload: UserPayloadParams): Promise<JwtTokenParams> {
        const refreshTokenOptions: any = {
            secret: this.configService.getOrThrow('jwt.refreshTokenSecret'),
            expiresIn: this.configService.getOrThrow('jwt.refreshTokenExpiration'),
        };

        const refreshToken: JwtTokenParams = {
            name: JwtTokenEnum.REFRESH,
            value: await this.jwtService.signAsync(userPayload, refreshTokenOptions),
            expiresIn: new Date(),
        };

        try {
            const tokenPayload: any = await this.jwtService.verifyAsync(refreshToken.value, refreshTokenOptions);
            refreshToken.expiresIn = new Date(tokenPayload.exp * 1000);
        } catch(error) {
            throw new UnauthorizedException('Invalid JWT token received.');
        }

        return (refreshToken);
    }

    async storeTokenInCookie(res: Response, token: JwtTokenParams, options?: any): Promise<void> {
        res.cookie(token.name, token.value, {
            ...options,
            expires: token.expiresIn,
        });
    }

}
