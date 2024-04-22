import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FrontendConfigEnvValidation {

    @IsNotEmpty()
    @IsString()
    host: string;

    @IsNotEmpty()
    @IsNumber()
    port: number;

}
