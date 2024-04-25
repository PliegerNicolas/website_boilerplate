import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class KeycloakConfigEnvValidation {

    @IsNotEmpty()
    @IsString()
    host: string;

    @IsNotEmpty()
    @IsNumber()
    port: number;

}
