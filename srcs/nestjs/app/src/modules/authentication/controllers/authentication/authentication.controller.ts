import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalRegisterDto } from '../../models/dtos/local/register.dto';
import { LocalLoginDto } from '../../models/dtos/local/login.dto';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { UserPayloadParams } from '../../models/types/jwt/payloads.type';
import { Request, Response } from 'express';
import { GoogleOAuthGuard } from '../../guards/google-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../../guards/jwt-refresh.guard';

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
    @ApiBody({ type: LocalLoginDto })
    @UseGuards(LocalAuthGuard)
    async loginLocal(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const userPayload: UserPayloadParams = req.user as UserPayloadParams;
        await this.authenticationService.loginUser(userPayload, res);
        res.status(HttpStatus.OK).json(userPayload);
    }

    /* Google strategy */

    @Get('google/register')
    @ApiOperation({ summary: 'Register through google oauth2 strategy.' })
    @UseGuards(GoogleOAuthGuard)
    async registerGoogle(
        @Req() req: Request,
    ) {
        const userPayload: UserPayloadParams = req.user as UserPayloadParams;
        return (userPayload);
    }

    @Get('google/login')
    @ApiOperation({ summary: 'Login (and register) through google oauth2 strategy.' })
    @UseGuards(GoogleOAuthGuard)
    async loginGoogle(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const userPayload: UserPayloadParams = req.user as UserPayloadParams;
        await this.authenticationService.loginUser(userPayload, res);
        res.status(HttpStatus.OK).json(userPayload);
    }

    @Get('google/callback')
    @UseGuards(GoogleOAuthGuard)
    async googleOauth2Callback(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const userPayload: UserPayloadParams = req.user as UserPayloadParams;
        await this.authenticationService.loginUser(userPayload, res);
        res.status(HttpStatus.OK).json(userPayload);
    }

    /* General */

    @Get('logout')
    @ApiOperation({ summary: 'Logout and invalidate JWT access and refresh tokens.' })
    @UseGuards(JwtAuthGuard)
    async logout(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.authenticationService.invalidateAndClearJwtTokensFromCookies(req, res);
        res.status(HttpStatus.OK).json("Successfully logged out.");
    }

    /* JWT tokens */

    @Get('refresh-access-token')
    @ApiOperation({ summary: 'Refresh JWT access token.' })
    @UseGuards(JwtRefreshGuard)
    async refreshAccessToken(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const userPayload: UserPayloadParams = req.user as UserPayloadParams;
        await this.authenticationService.refreshAccessToken(userPayload, req, res);
        res.status(HttpStatus.OK).json(userPayload);
    }

}
