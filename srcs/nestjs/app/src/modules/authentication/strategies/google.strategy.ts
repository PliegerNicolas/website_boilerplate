import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { UserPayloadParams } from "../models/types/jwt/payloads.type";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { GoogleLoginParams } from "../models/types/google/google-login.type";
import { GoogleRegisterParams } from "../models/types/google/google-register.type";
import { RegistrationMethodEnum } from "src/modules/users/models/enums/registration-method.enum";

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
        const googleUserDetails: GoogleRegisterParams = {
            email: profile.emails.find((email: any) => email.verified)?.value,
            username: profile.displayName,
            googleId: profile.id,
        }

        if (!googleUserDetails.email) throw new UnauthorizedException('Invalid or unverified email address received through google oauth2 protocol');
    
        const userPayload: UserPayloadParams | null = (
            await this.authenticationService.validateGoogleUser(googleUserDetails)
            || await this.authenticationService.registerGoogleUser(googleUserDetails)
        );

        if (!userPayload) throw new UnauthorizedException('Failed to verify/register account through google oauth2 protocol');

        return (userPayload);
    }

}