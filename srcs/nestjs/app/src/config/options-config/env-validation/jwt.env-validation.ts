import { IsNotEmpty, IsString } from 'class-validator';

export class JwtConfigEnvValidation {

    @IsNotEmpty()
    @IsString()
    jwtSecret: string;

    @IsNotEmpty()
    @IsString()
    jwtRefreshSecret: string;

    @IsNotEmpty()
    @IsString()
    accessTokenExpiration: string;

    @IsNotEmpty()
    @IsString()
    refreshTokenExpiration: string;

}
