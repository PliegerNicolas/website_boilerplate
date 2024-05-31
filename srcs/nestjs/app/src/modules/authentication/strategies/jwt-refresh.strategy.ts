import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserPayloadParams } from "../models/types/jwt/payloads.type";
import { Request } from "express";
import { UsersService } from "src/modules/users/services/users/users.service";
import { User } from "src/modules/users/entities/user.entity";
import { HashingService } from "src/utils/hashing/services/hashing/hashing.service";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly hashingService: HashingService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtRefreshTokenStrategy.fromCookies,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('jwt.refreshTokenSecret'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: UserPayloadParams): Promise<UserPayloadParams> {
        if  (!payload) throw new UnauthorizedException(); // TODO.

        const userPayload: UserPayloadParams = {
            uuid: payload.uuid,
            username: payload.username,
        };

        const user: User | null = await this.usersService.findUserByUuid(userPayload.uuid);
        if (!user) throw new UnauthorizedException(); // TODO.

        const refreshToken: string = req.cookies['refresh_token'];

        if (!await this.hashingService.compare(user.refreshToken, refreshToken)) {
            throw new UnauthorizedException(); // TODO.
        }

        return (userPayload);
    }

    /* JWT retrieval method */

    private static fromCookies(req: Request): string | null {
        const refreshToken: string | undefined = req?.cookies['refresh_token'];

        if (!refreshToken) return (null);

        return (refreshToken);
    } 

}