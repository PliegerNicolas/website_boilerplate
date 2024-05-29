import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalRegisterDto } from '../../models/dtos/local/register.dto';
import { LocalLoginDto } from '../../models/dtos/local/login.dto';
import { GoogleRegisterDto } from '../../models/dtos/google/register.dto';
import { GoogleLoginDto } from '../../models/dtos/google/login.dto';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { UserPayloadParams } from '../../models/types/jwt/payloads.type';
import { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthenticationController {

    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    /* Local strategy */

    @Post('local/register')
    @ApiOperation({ summary: 'Register through local strategy.' })
    async registerLocalUser(
        @Body() localDetails: LocalRegisterDto,
    ): Promise<UserPayloadParams> {
        return (await this.authenticationService.registerLocalUser(localDetails));
    }

    @Post('local/login')
    @ApiOperation({ summary: 'Login through local strategy.' })
    @UseGuards(LocalAuthGuard)
    async loginLocal(
        @Body() localDetails: LocalLoginDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const userPayload: UserPayloadParams = await this.authenticationService.loginLocalUser(localDetails, res);
        res.status(HttpStatus.OK).json(userPayload);
    }

    /* Google strategy */

    @Get('google/register')
    @ApiOperation({ summary: 'Register through google oauth2 strategy.' })
    async registerGoogle(
        @Body() googleDetails: GoogleRegisterDto,
    ) {
        return (null);
    }

    @Get('google/login')
    @ApiOperation({ summary: 'Login through google oauth2 strategy.' })
    async loginGoogle(
        @Body() googleDetails: GoogleLoginDto,
    ) {
        return (null);
    }

    /* General */

    @Get('logout')
    @ApiOperation({ summary: 'Logout and invalidate JWT access and refresh tokens.' })
    async logout(

    ) {
        return (null);
    }

    /* JWT tokens */

    @Get('refresh-access-token')
    @ApiOperation({ summary: 'Refresh JWT access token.' })
    async refreshAccessToken(

    ) {
        return (null);
    }

}
