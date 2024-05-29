import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { RegistrationMethodEnum } from "../enums/registration-method.enum";
import { RequiredIf } from "src/utils/validators/required-if/required-if.decorator";

export class ReplaceUserDto {

    @ApiProperty({ description: 'Email.' })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'Display name / username.' })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly displayName: string;

    @ApiProperty({ description: 'Through wich method they registered (Local, Oauth2_google, ...).' })
    @IsDefined()
    @IsNotEmpty()
    @IsEnum(RegistrationMethodEnum)
    readonly registrationMethod: RegistrationMethodEnum;

    @ApiProperty({ description: 'Password. It\'s presence is only necessary with local registration method.' })
    @RequiredIf({
        key: 'registrationMethod',
        expectedValue: RegistrationMethodEnum.LOCAL
    })
    readonly password: string | undefined;

}