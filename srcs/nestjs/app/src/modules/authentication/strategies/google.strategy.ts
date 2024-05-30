import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { UserPayloadParams } from "../models/types/jwt/payloads.type";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { GoogleLoginParams } from "../models/types/google/google-login.type";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly configService: ConfigService,
    ) {
        super({
            clientID: configService.getOrThrow<string>('googleClient.id'),
            clientSecret: configService.getOrThrow<string>('googleClient.secret'),
            callbackURL: configService.getOrThrow<string>('googleClient.callbackURL'),
            passReqToCallback: true,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<UserPayloadParams> {
        const email: string | null = profile.emails.find((email: any) => email.verified)?.value;
        if (!email) throw new UnauthorizedException('Google oauth2 protocol didn\'t return a valid and verified email address.');
        
        const googleUserDetails: GoogleLoginParams = {
            email: email,
        }

        const userPayload: UserPayloadParams | null = await this.authenticationService.validateGoogleUser(googleUserDetails);

        if (!userPayload) throw new UnauthorizedException(); // Add explicit msg.

        return (userPayload);
    }

}