import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

    @Get(':displayName')
    @ApiOperation({ summary: 'Retrieve a user by displayName.' })
    async getUser(
        @Param('displayName') displayName: string,
    ): Promise <User> {
        return (await this.userService.getUser(displayName));
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user.' })
    async createUser(
        @Body() userDetails: CreateUserDto,
    ): Promise<User> {
        return (await this.userService.createUser(userDetails));
    }

    @Put(':displayName')
    @ApiOperation({ summary: 'Replace a user by displayName.' })
    async replaceUser(
        @Param('displayName') displayName: string,
        @Body() userDetails: ReplaceUserDto,
    ): Promise<User> {
        return (await this.userService.replaceUser(displayName, userDetails));
    }

    @Patch(':displayName')
    @ApiOperation({ summary: 'Partially update a user by displayName.' })
    async updateUser(
        @Param('displayName') displayName: string,
        @Body() userDetails: UpdateUserDto,
    ): Promise<User> {
        return (await this.userService.updateUser(displayName, userDetails));
    }

    @Delete(':displayName')
    @ApiOperation({ summary: 'Delete a user by displayName.' })
    async deleteUser(
        @Param('displayName') displayName: string,
    ): Promise<string> {
        return (await this.userService.deleteUser(displayName));
    }

}
