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
import { GoogleOAuthGuard } from '../../guards/google-auth.guard';
import { GoogleLoginParams } from '../../models/types/google/google-login.type';

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
    @ApiOperation({ summary: 'Login and register through google oauth2 strategy. It is equivalent to /api/auth/google/login path.' })
    @UseGuards(GoogleOAuthGuard)
    async registerGoogle(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        console.log(req);
        const googleUserDetails: GoogleLoginParams = {
            email: 'oui',
        };
        const userPayload: UserPayloadParams = await this.authenticationService.loginAndRegisterGoogleUser(googleUserDetails, res);
        res.status(HttpStatus.OK).json(userPayload);
    }

    @Get('google/login')
    @ApiOperation({ summary: 'Login and register through google oauth2 strategy. It is equivalent to /api/auth/google/register path.' })
    @UseGuards(GoogleOAuthGuard)
    async loginGoogle(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        console.log(req);
        const googleUserDetails: GoogleLoginParams = {
            email: 'oui',
        };
        const userPayload: UserPayloadParams = await this.authenticationService.loginAndRegisterGoogleUser(googleUserDetails, res);
        res.status(HttpStatus.OK).json(userPayload);
    }

    @Get('google/callback')
    @UseGuards(GoogleOAuthGuard)
    async googleOauth2Callback(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        // ????
        //res.redirect('./');
        return ("Pomme");
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
