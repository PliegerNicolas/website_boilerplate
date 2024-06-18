import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleClientConfigEnvValidation {

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    secret: string;

    @IsNotEmpty()
    @IsString()
    callbackURL: string;

}
