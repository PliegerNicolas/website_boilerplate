import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly displayName: string;

}

export class CreateLocalUserDto extends CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    readonly password: string;
    
}

export class CreateGoogleUserDto extends CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    readonly googleId: string;

}