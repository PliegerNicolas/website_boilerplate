import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
    constructor() {
        super({
            accessType: 'offline', 
        });
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user) throw new UnauthorizedException(`Failed to authenticate`);
        return (user);
    }
}