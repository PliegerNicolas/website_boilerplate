import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh-token') {

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user) throw new UnauthorizedException(`Should be authenticated`);
        return (user);
    }

}