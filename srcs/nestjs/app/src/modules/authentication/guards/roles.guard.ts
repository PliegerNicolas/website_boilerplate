import { ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { RoleEnum } from "src/modules/users/models/enums/role.enum";
import { UserPayloadParams } from "../models/types/jwt/payloads.type";
import { User } from "src/modules/users/entities/user.entity";
import { UsersService } from "src/modules/users/services/users/users.service";
import { AuthGuard } from "@nestjs/passport";
import { ROLE_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard extends AuthGuard('role')  {

    constructor(
        private readonly reflector: Reflector,
        private readonly usersService: UsersService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const roles = this.reflector.get<RoleEnum[]>(ROLE_KEY, context.getHandler()); // TODO.

        if (!roles) return (true);

        const request: Request = context.switchToHttp().getRequest();
        const userPayload: UserPayloadParams = request.user as UserPayloadParams;

        const user: User | null = await this.usersService.findUserByUuid(userPayload.uuid);
        if (!user) return (false);

        if (!roles.some((role) => role === user.role)) throw new ForbiddenException('Not enough permissions.');

        return (true);
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user) {
            throw new ForbiddenException(); // TODO.
        }

        return (user);
    }

}