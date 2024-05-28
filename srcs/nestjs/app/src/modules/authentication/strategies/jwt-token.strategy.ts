import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayloadParams } from "../models/types/token-payload.type";
import { Request } from "express";

@Injectable()
export class JwtTokenStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtTokenStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
            passReqToCallback: true,
        });
    }

    validate(tokenPayload: TokenPayloadParams): TokenPayloadParams {
        return (tokenPayload);
    }

    /* Other */

    private static extractJWT(request: Request): string | null {
        return (request?.cookies['accessToken']);
    }

}