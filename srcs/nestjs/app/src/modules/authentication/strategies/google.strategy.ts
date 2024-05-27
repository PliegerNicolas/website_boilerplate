import { Injectable, UnauthorizedException } from "@nestjs/common";
import { VerifyCallback } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { TokenPayloadParams } from "../models/types/token-payload.type";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {
        super({
            clientID: process.env.GOOGLE_OAUTH2_ID ?? 'default',
            clientSecret: process.env.GOOGLE_OAUTH2_SECRET ?? 'default',
            callbackURL: process.env.GOOGLE_OAUTH2_CALLBACK_URL ?? 'default',
            passReqToCallback: true,
            scope: ['email', 'profile'],
        });
    }

    async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<TokenPayloadParams> {
        const tokenPayload: TokenPayloadParams | null = await this.authenticationService.validateGoogleUser(profile);

        if (!tokenPayload) throw new UnauthorizedException(`User unauthorized.`);

        return (tokenPayload);
    }

}