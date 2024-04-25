import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../../models/dtos/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(
        private readonly userService: UsersService,
    ) {}

    @Get()
    async getUsers(): Promise <User[]> {
        return (await this.userService.getUsers());
    }

    @Post()
    async createUser(
        @Body() userDetails: CreateUserDto,
    ): Promise<User> {
        return (await this.userService.createUser(userDetails));
    }

}
