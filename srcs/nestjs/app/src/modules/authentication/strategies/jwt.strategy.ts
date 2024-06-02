import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserPayloadParams } from "../models/types/jwt/payloads.type";
import { Request } from "express";
import { User } from "src/modules/users/entities/user.entity";
import { UsersService } from "src/modules/users/services/users/users.service";
import { AuthenticationService } from "../services/authentication/authentication.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly authenticationService: AuthenticationService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.fromCookies,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('jwt.accessTokenSecret'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any): Promise<UserPayloadParams> {
        if (await this.authenticationService.isJwtTokenBlacklisted(req.cookies['access_token'])) {
            throw new UnauthorizedException();
        }

        const userPayload: UserPayloadParams = {
            uuid: payload.uuid,
            username: payload.username,
            role: payload.role,
        };

        const user: User | null = await this.usersService.findUserByUuid(userPayload.uuid);
        if (!user) throw new UnauthorizedException();

        return (userPayload);
    }

    /* JWT retrieval method */

    private static fromCookies(request: Request): string | null {
        const accessToken: string | undefined = request?.cookies[`access_token`];

        if (!accessToken) return (null);

        return (accessToken);
    } 

}