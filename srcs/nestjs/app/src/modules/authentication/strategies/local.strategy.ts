import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { TokenPayloadParams } from "../models/types/token-payload.type";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {
        super({
            usernameField: 'displayName',
            passwordField: 'password',
        });
    }

    async validate(displayName: string, password: string) {
        const tokenPayload: TokenPayloadParams | null = await this.authenticationService.validateLocalUser(displayName, password);
    
        if (!tokenPayload) throw new UnauthorizedException('User unauthorized.');

        return (tokenPayload);
    }

}