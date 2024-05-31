import { ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

const HTTP_STATUS_TOKEN_EXPIRED = 498

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(
        private readonly reflector: Reflector,
    ) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic: boolean = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
        if (isPublic) return (true);

        return (super.canActivate(context))
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user) {
            console.log("stiti");
            console.log(info);
            if (info && info.name === 'TokenExpiredError') {
                // Refresh access token here if jwt-refresh-token safe.
                throw new HttpException('Jwt access token expired', HTTP_STATUS_TOKEN_EXPIRED); // TODO.
            } else {
                throw new UnauthorizedException(); // TODO.
            }
        }

        return (user);
    }

}