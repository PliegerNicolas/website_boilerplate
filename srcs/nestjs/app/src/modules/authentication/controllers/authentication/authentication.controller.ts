import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { GoogleOAuthGuard } from '../../guards/google-auth.guard';
import { LocalUserLoginDto } from '../../models/dtos/local-user-login.dto';

// Set les cookies.
// Check système de refresh des tokens (avec code erreur pour trigger le frontend).
// Set la blacklist.
// Check si le login est fonctionnel.

@ApiTags('auth')
@Controller('auth')
export class AuthenticationController {

    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    /* Local strategy */

    @Post('local/login')
    @ApiOperation({ summary: 'Login with local strategy.' })
    @ApiBody({ type: LocalUserLoginDto })
    @UseGuards(LocalAuthGuard)
    async loginWithLocal(
        @Request() req: any,
        @Res() res: Response,
    ) {
        console.log(req.user);
        return (null);
    }

    /* Google Oauth2 strategy */

    @Get('google/login')
    @ApiOperation({ summary: 'Login with google oauth2 strategy.' })
    @UseGuards(GoogleOAuthGuard)
    async loginWithGoogle(
        @Request() req: any,
    ) {
        const user: any = req.user;
        return (null);
    }

    @Get('google/redirect')
    @ApiOperation({ summary: 'Google oauth2\'s redirection endpoint.' })
    @UseGuards(GoogleOAuthGuard)
    async loginWithGoogleRedirect(
        @Request() req: any,
    ) {
        const user: any = req.user;
        return (null);
    }

    /* General */

    @Get('logout')
    @ApiOperation({ summary: 'Logout.' })
    async logout(
        @Request() req: any,
    ) {
        const user: any = req.user;
        return (null);
    }

    @Get('refresh')
    @ApiOperation({ summary: 'Refresh JWT tokens.' })
    async refresh(
        @Request() req: any,
    ) {
        const user: any = req.user;
        return (null);
    }

    /* Other */

}
