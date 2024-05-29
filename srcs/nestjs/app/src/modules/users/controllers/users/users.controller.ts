import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../../models/dtos/create-user.dto';
import { ReplaceUserDto } from '../../models/dtos/replace-user.dto';
import { UpdateUserDto } from '../../models/dtos/update-user.dto';
import { GetUsersQueryDto } from '../../models/dtos/query-params/get-users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(
        private readonly userService: UsersService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Retrieves a list of all users.' })
    async getUsers(
        @Query(new ValidationPipe({ transform: true, whitelist: true })) GetUsersQueryDto: GetUsersQueryDto,
    ): Promise <User[]> {
        return (await this.userService.getUsers(GetUsersQueryDto));
    }

    @Get(':username')
    @ApiOperation({ summary: 'Retrieve a user by username.' })
    async getUser(
        @Param('username') username: string,
    ): Promise <User> {
        return (await this.userService.getUser(username));
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user.' })
    async createUser(
        @Body() userDetails: CreateUserDto,
    ): Promise<User> {
        return (await this.userService.createUser(userDetails));
    }

    @Put(':username')
    @ApiOperation({ summary: 'Replace a user by username.' })
    async replaceUser(
        @Param('username') username: string,
        @Body() userDetails: ReplaceUserDto,
    ): Promise<User> {
        return (await this.userService.replaceUser(username, userDetails));
    }

    @Patch(':username')
    @ApiOperation({ summary: 'Partially update a user by username.' })
    async updateUser(
        @Param('username') username: string,
        @Body() userDetails: UpdateUserDto,
    ): Promise<User> {
        return (await this.userService.updateUser(username, userDetails));
    }

    @Delete(':username')
    @ApiOperation({ summary: 'Delete a user by username.' })
    async deleteUser(
        @Param('username') username: string,
    ): Promise<string> {
        return (await this.userService.deleteUser(username));
    }

}
