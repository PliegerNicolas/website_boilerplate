import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { ReplaceUserDto } from '../../models/dtos/replace-user.dto';
import { UpdateUserDto } from '../../models/dtos/update-user.dto';
import { GetUsersQueryDto } from '../../models/dtos/query-params/get-users.dto';
import { Public } from 'src/modules/authentication/decorators/public.decorator';
import { ServerRoles } from 'src/modules/authentication/decorators/roles.decorator';
import { ServerRole } from '../../models/enums/role.enum';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { ServerRolesGuard } from 'src/modules/authentication/guards/server-roles.guard';
import { UserPayloadParams } from 'src/modules/authentication/models/types/jwt/payloads.type';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, ServerRolesGuard)
export class UsersController {

    constructor(
        private readonly userService: UsersService,
    ) {}

    /* General paths */

    @Get()
    @ApiOperation({ summary: 'Retrieves a list of all users.' })
    @ServerRoles(ServerRole.USER)
    async getUsers(
        @Query(new ValidationPipe({ transform: true, whitelist: true })) GetUsersQueryDto: GetUsersQueryDto,
    ): Promise <User[]> {
        return (await this.userService.getUsers(GetUsersQueryDto));
    }

    @Get(':username')
    @ApiOperation({ summary: 'Retrieve a user by username.' })
    @ServerRoles(ServerRole.USER)
    async getUser(
        @Param('username') username: string,
    ): Promise <User> {
        return (await this.userService.getUser(username));
    }

    @Put(':username')
    @ApiOperation({ summary: 'Replace a user by username.' })
    @ServerRoles(ServerRole.ADMIN)
    async replaceUser(
        @Param('username') username: string,
        @Body() userDetails: ReplaceUserDto,
    ): Promise<User> {
        return (await this.userService.replaceUser(username, userDetails));
    }

    @Patch(':username')
    @ApiOperation({ summary: 'Partially update a user by username.' })
    @ServerRoles(ServerRole.ADMIN)
    async updateUser(
        @Param('username') username: string,
        @Body() userDetails: UpdateUserDto,
    ): Promise<User> {
        return (await this.userService.updateUser(username, userDetails));
    }

    @Delete(':username')
    @ApiOperation({ summary: 'Delete a user by username.' })
    @ServerRoles(ServerRole.ADMIN)
    async deleteUser(
        @Param('username') username: string,
    ): Promise<string> {
        return (await this.userService.deleteUser(username));
    }

}