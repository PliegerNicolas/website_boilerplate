import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BackendConfigEnvValidation {

    @IsNotEmpty()
    @IsString()
    host: string;

    @IsNotEmpty()
    @IsNumber()
    port: number;

}
