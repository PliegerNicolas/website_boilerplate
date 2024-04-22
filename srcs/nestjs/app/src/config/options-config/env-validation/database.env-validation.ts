import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DatabaseConfigEnvValidation {

    @IsNotEmpty()
    @IsString()
    host: string;

    @IsNotEmpty()
    @IsNumber()
    port: number;

    @IsNotEmpty()
    @IsString()
    db: string;

    @IsNotEmpty()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsString()
    password: string;

}
