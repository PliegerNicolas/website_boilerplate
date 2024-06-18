import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RedisConfigEnvValidation {

    @IsNotEmpty()
    @IsString()
    host: string;

    @IsNotEmpty()
    @IsNumber()
    port: number;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

}
