import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { RegistrationMethodEnum } from "../enums/registration-method.enum";
import { RequiredIf } from "src/utils/validators/required-if/required-if.decorator";

export class ReplaceUserDto {

    @ApiProperty({ description: 'Email' })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'Username' })
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @ApiProperty({ description: 'Through wich method they registered (Local, Oauth2_google, ...)' })
    @IsNotEmpty()
    @IsEnum(RegistrationMethodEnum)
    readonly registrationMethod: RegistrationMethodEnum;

    @ApiProperty({ description: 'Password. It\'s presence is only necessary with local registration method' })
    @RequiredIf({
        key: 'registrationMethod',
        expectedValue: RegistrationMethodEnum.LOCAL
    })
    readonly password: string | undefined;

}