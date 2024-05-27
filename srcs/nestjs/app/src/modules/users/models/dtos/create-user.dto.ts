import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { RegistrationMethod } from "../enums/registration-method.enum";
import { RequiredIf } from "src/utils/validators/required-if/required-if.decorator";

export class CreateUserDto {

    @ApiProperty({ description: 'Email.' })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'Display name / username.' })
    @IsNotEmpty()
    @IsString()
    readonly displayName: string;

    @ApiProperty({ description: 'Through wich method they registered (Local, Oauth2_google, ...).' })
    @IsNotEmpty()
    @IsEnum(RegistrationMethod)
    readonly registrationMethod: RegistrationMethod;

    @ApiProperty({ description: 'Password. It\'s presence is only necessary with local registration method.' })
    @RequiredIf({
        key: 'registrationMethod',
        expectedValue: RegistrationMethod.LOCAL
    })
    readonly password: string | undefined;

}