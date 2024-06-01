import { ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Request } from "express";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { accessTokenOptions } from "../models/constants/token-options.const";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { HTTP_STATUS_TOKEN_EXPIRED } from "../models/constants/http-status.const";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic: boolean = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
        if (isPublic) return (true);

        return (super.canActivate(context))
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        const req: Request = context.switchToHttp().getRequest();
        const accessToken: string = req.cookies['access_token'];

        if (err || !user) {

            if (accessToken) {
                try {
                    const payload: any = this.jwtService.verify(accessToken, accessTokenOptions(this.configService));
                } catch(error) {
                    if (error instanceof TokenExpiredError) throw new HttpException('Access token expired.', HTTP_STATUS_TOKEN_EXPIRED);
                    throw new UnauthorizedException('Invalid access token. It might have been tinkered with...'); // TODO.
                }
            }
            throw new UnauthorizedException(); // TODO.
        }

        return (user);
    }

}