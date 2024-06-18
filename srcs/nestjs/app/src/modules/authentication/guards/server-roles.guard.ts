import { ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ServerRole } from "src/modules/users/models/enums/role.enum";
import { UserPayloadParams } from "../models/types/jwt/payloads.type";
import { User } from "src/modules/users/entities/user.entity";
import { UsersService } from "src/modules/users/services/users/users.service";
import { AuthGuard } from "@nestjs/passport";
import { SERVER_ROLE_KEY } from "../decorators/roles.decorator";

@Injectable()
export class ServerRolesGuard extends AuthGuard('server-role')  {

    constructor(
        private readonly reflector: Reflector,
        private readonly usersService: UsersService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const serverRoles = this.reflector.get<ServerRole[]>(SERVER_ROLE_KEY, context.getHandler()); // TODO.

        if (!serverRoles) return (true);

        const request: Request = context.switchToHttp().getRequest();
        const userPayload: UserPayloadParams = request.user as UserPayloadParams;

        const user: User | null = await this.usersService.findUserByUuid(userPayload.uuid);
        if (!user) return (false);

        if (!serverRoles.some((serverRole) => serverRole === user.serverRole)) {
            throw new ForbiddenException('Not enough permissions.');
        }

        return (true);
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user) {
            throw new ForbiddenException(); // TODO.
        }

        return (user);
    }

}