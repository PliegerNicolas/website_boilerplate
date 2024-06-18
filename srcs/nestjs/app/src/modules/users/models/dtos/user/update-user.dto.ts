import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {

    @ApiProperty({ description: 'Email' })
    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    readonly email?: string;

    @ApiProperty({ description: 'Username' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly username?: string;

    @ApiProperty({ description: 'Password. Giving a password enforces local authentication strategy.' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    password?: string;

}