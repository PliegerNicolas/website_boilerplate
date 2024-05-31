import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserPayloadParams } from "../models/types/jwt/payloads.type";
import { Request } from "express";
import { User } from "src/modules/users/entities/user.entity";
import { UsersService } from "src/modules/users/services/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.fromCookies,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('jwt.accessTokenSecret'),
        });
    }

    async validate(payload: UserPayloadParams): Promise<UserPayloadParams> {
        const userPayload: UserPayloadParams = {
            uuid: payload.uuid,
            username: payload.username,
        };

        const user: User | null = await this.usersService.findUserByUuid(userPayload.uuid);
        if (!user) throw new UnauthorizedException('Unauthorized. Invalid jwt access token payload.');

        return (userPayload);
    }

    /* JWT retrieval method */

    private static fromCookies(request: Request): string | null {
        const accessToken: string | undefined = request?.cookies[`access_token`];

        if (!accessToken) return (null);

        return (accessToken);
    } 

}