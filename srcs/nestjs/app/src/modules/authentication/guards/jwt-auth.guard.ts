import { ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

const HTTP_STATUS_TOKEN_EXPIRED = 498

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor() {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Exclude public paths ?

        return (super.canActivate(context))
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user) {
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