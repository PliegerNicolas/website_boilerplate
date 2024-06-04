import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { RegistrationMethodDto } from "../registration-method/registration-method.dto";

export class ReplaceUserDto {

    @ApiProperty({ description: 'Email' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'Username' })
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @ApiProperty({ description: 'Registration method(s).' })
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(1)
    @ValidateNested({ each: true })
    @Type(() => RegistrationMethodDto)
    readonly registrationMethod: RegistrationMethodDto;

}