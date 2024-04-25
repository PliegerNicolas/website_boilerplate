import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class DatabaseConfig {

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

export class DatabasesConfigEnvValidation {

    @ValidateNested()
    @Type(() => DatabaseConfig)
    for_nestjs: DatabaseConfig;

}