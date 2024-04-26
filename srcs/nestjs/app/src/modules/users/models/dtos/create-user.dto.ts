import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { RegistrationMethod } from "../enums/registration-method.enum";
import { RequiredIf } from "src/utils/validators/required-if/required-if.decorator";
import { BeforeInsert, BeforeUpdate } from "typeorm";

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

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(RegistrationMethod)
    readonly registrationMethod: RegistrationMethod;

    @ApiProperty()
    @RequiredIf({
        key: 'registrationMethod',
        expectedValue: RegistrationMethod.LOCAL
    })
    readonly password?: string;

}