import { Body, Controller, Delete, Get, Param, Patch, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { ReplaceUserDto } from '../../models/dtos/replace-user.dto';
import { UpdateUserDto } from '../../models/dtos/update-user.dto';
import { GetUsersQueryDto } from '../../models/dtos/query-params/get-users.dto';
import { Public } from 'src/modules/authentication/decorators/public.decorator';
import { Roles } from 'src/modules/authentication/decorators/roles.decorator';
import { RoleEnum } from '../../models/enums/role.enum';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/authentication/guards/roles.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {

    constructor(
        private readonly userService: UsersService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Retrieves a list of all users.' })
    @Public()
    async getUsers(
        @Query(new ValidationPipe({ transform: true, whitelist: true })) GetUsersQueryDto: GetUsersQueryDto,
    ): Promise <User[]> {
        return (await this.userService.getUsers(GetUsersQueryDto));
    }

    @Get(':username')
    @ApiOperation({ summary: 'Retrieve a user by username.' })
    @Roles(RoleEnum.USER) // Should add a ME. TODO.
    async getUser(
        @Param('username') username: string,
    ): Promise <User> {
        return (await this.userService.getUser(username));
    }

    @Put(':username')
    @ApiOperation({ summary: 'Replace a user by username.' })
    @Roles(RoleEnum.USER) // Should add a ME.
    async replaceUser(
        @Param('username') username: string,
        @Body() userDetails: ReplaceUserDto,
    ): Promise<User> {
        return (await this.userService.replaceUser(username, userDetails));
    }

    @Patch(':username')
    @ApiOperation({ summary: 'Partially update a user by username.' })
    @Roles(RoleEnum.USER) // Should add a ME.
    async updateUser(
        @Param('username') username: string,
        @Body() userDetails: UpdateUserDto,
    ): Promise<User> {
        return (await this.userService.updateUser(username, userDetails));
    }

    @Delete(':username')
    @ApiOperation({ summary: 'Delete a user by username.' })
    @Roles(RoleEnum.ADMIN) // Should add a ME.
    async deleteUser(
        @Param('username') username: string,
    ): Promise<string> {
        return (await this.userService.deleteUser(username));
    }

}
