import { ApiProperty } from "@nestjs/swagger";
import { RegistrationMethodDto } from "../registration-method/registration-method.dto";
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateUserDto {

    @ApiProperty({ description: 'Email' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'Username' })
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @ApiProperty({ description: 'Registration method' })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => RegistrationMethodDto)
    readonly registrationMethod: RegistrationMethodDto;

}