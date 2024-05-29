import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { LocalLoginDto } from "../models/dtos/local/login.dto";
import { UserPayloadParams } from "../models/types/jwt/payloads.type";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        });
    }

    async validate(username: string, password: string) {
        const userDetails: LocalLoginDto = {
            username: username,
            password: password,
        };

        const userPayload: UserPayloadParams | null = await this.authenticationService.validateLocalUser(userDetails);

        if (!userPayload) throw new UnauthorizedException('Invalid username and/or password.');

        return (userPayload);
    }

}