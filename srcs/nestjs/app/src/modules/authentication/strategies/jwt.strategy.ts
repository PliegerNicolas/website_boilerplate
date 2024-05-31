import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserPayloadParams } from "../models/types/jwt/payloads.type";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        private readonly configService: ConfigService,
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
        if (!payload) throw new UnauthorizedException(); // TODO.

        const userPayload: UserPayloadParams = {
            uuid: payload.uuid,
            username: payload.username,
        };

        return (userPayload);
    }

    /* JWT retrieval method */

    private static fromCookies(request: Request): string | null {
        const accessToken: string | undefined = request?.cookies[`access_token`];

        if (!accessToken) return (null);

        return (accessToken);
    } 

}