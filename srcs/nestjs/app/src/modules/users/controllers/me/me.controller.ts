import { Body, Controller, Delete, Get, Patch, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { ServerRolesGuard } from 'src/modules/authentication/guards/server-roles.guard';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../entities/user.entity';
import { UserPayloadParams } from 'src/modules/authentication/models/types/jwt/payloads.type';
import { ReplaceUserDto } from '../../models/dtos/user/replace-user.dto';
import { UpdateUserDto } from '../../models/dtos/user/update-user.dto';

@ApiTags('me')
@Controller('me')
@UseGuards(JwtAuthGuard, ServerRolesGuard)
export class MeController {

    constructor(
        private readonly userService: UsersService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Retrieve currently authenticated user.' })
    async getMe(
        @Req() req: any,
    ): Promise <User> {
        const user: UserPayloadParams = req.user as UserPayloadParams;
        return (await this.userService.getUser(user.username));
    }

    @Put()
    @ApiOperation({ summary: 'Replace currently authenticated user.' })
    async replaceMe(
        @Body() userDetails: ReplaceUserDto,
        @Req() req: any,
    ): Promise <User> {
        const user: UserPayloadParams = req.user as UserPayloadParams;
        return (await this.userService.replaceUser(user.username, userDetails));
    }

    @Patch()
    @ApiOperation({ summary: 'Partially update currently authenticated user.' })
    async updateMe(
        @Body() userDetails: UpdateUserDto,
        @Req() req: any,
    ): Promise <User> {
        const user: UserPayloadParams = req.user as UserPayloadParams;
        return (await this.userService.updateUser(user.username, userDetails));
    }

    @Delete()
    @ApiOperation({ summary: 'Delete currently authenticated user.' })
    async deleteMe(
        @Req() req: any,
    ): Promise <string> {
        const user: UserPayloadParams = req.user as UserPayloadParams;
        return (await this.userService.deleteUser(user.username));
    }

}
