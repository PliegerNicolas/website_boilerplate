import { Controller, Get, Post } from '@nestjs/common';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthenticationController {

    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    /* Local strategy */

    @Post('local/register')
    @ApiOperation({ summary: 'Register through local strategy.' })
    async registerLocalUser() {}

    @Post('local/login')
    @ApiOperation({ summary: 'Login through local strategy.' })
    async loginLocal() {}

    /* Google strategy */

    @Get('google/register')
    @ApiOperation({ summary: 'Register through google oauth2 strategy.' })
    async registerGoogle() {}

    @Get('google/login')
    @ApiOperation({ summary: 'Login through google oauth2 strategy.' })
    async loginGoogle() {}

    /* General */

    @Get('logout')
    @ApiOperation({ summary: 'Logout and invalidate JWT access and refresh tokens.' })
    async logout() {}

    /* JWT tokens */

    @Get('refresh-access-token')
    @ApiOperation({ summary: 'Refresh JWT access token.' })
    async refreshAccessToken() {}

}
