import { IsNotEmpty, IsString } from 'class-validator';

export class JwtConfigEnvValidation {

    @IsNotEmpty()
    @IsString()
    accessTokenSecret: string;

    @IsNotEmpty()
    @IsString()
    refreshTokenSecret: string;

    @IsNotEmpty()
    @IsString()
    accessTokenExpiration: string;

    @IsNotEmpty()
    @IsString()
    refreshTokenExpiration: string;

}
