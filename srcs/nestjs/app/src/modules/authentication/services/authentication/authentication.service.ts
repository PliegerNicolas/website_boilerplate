import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users/users.service';
import { TokenPayloadParams } from '../../models/types/token-payload.type';
import { User } from 'src/modules/users/entities/user.entity';
import { HashingService } from 'src/utils/hashing/services/hashing/hashing.service';
import { LoginJwtTokensParams } from '../../models/types/jwt-tokens.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {

    constructor(
        private readonly usersService: UsersService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async validateLocalUser(displayName: string, plainPassword: string): Promise<TokenPayloadParams | null> {
        const user: User | null = await this.usersService.findUserByDisplayName(displayName);

        if (!user || !await this.hashingService.compare(user.password, plainPassword)) {
            return (null);
        }

        const tokenPayload: TokenPayloadParams = { ...user };
        return (tokenPayload);
    }

    async validateGoogleUser(profile: any): Promise<TokenPayloadParams | null> {
        const email: string = profile.emails.find((email: any) => email.verified)?.value;

        console.log(profile);

        const user = await this.usersService.findUserByEmail(email);

        if (!user) return (null);

        const tokenPayload: TokenPayloadParams = { ...user };
        return (tokenPayload);
    }

    async login(tokenPayload: TokenPayloadParams): Promise<LoginJwtTokensParams> {
        const jwtTokens: LoginJwtTokensParams = {
            accessToken: await this.generateJwtToken(tokenPayload),
            refreshToken: await this.generateRefreshToken(tokenPayload),
        };

        return (jwtTokens);
    }

    async logout(tokenPayload: TokenPayloadParams) {
        // Setup blacklist with REDIS:
    }

    async refresh(tokenPayload: TokenPayloadParams) {
        return (this.generateJwtToken(tokenPayload));
    }
    
    /* Other */

    async generateJwtToken(tokenPayload: TokenPayloadParams): Promise<string> {
        return (await this.jwtService.signAsync(
            tokenPayload,
            {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
            },
        ));
    }

    async generateRefreshToken(tokenPayload: TokenPayloadParams): Promise<string> {
        return (await this.jwtService.signAsync(
            tokenPayload,
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
            },
        ));
    }

}
