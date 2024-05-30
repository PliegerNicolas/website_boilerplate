import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { RegistrationMethodEnum } from "src/modules/users/models/enums/registration-method.enum";

export class GoogleRegisterDto {

    @ApiProperty({ description: 'Email' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'Username' })
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    // Automatically filled in.
    @IsNotEmpty()
    @IsEnum(RegistrationMethodEnum)
    readonly registrationMethod: RegistrationMethodEnum = RegistrationMethodEnum.GOOGLE_OAUTH2;

    // Automatically filled in.
    @IsEmpty()
    readonly password: undefined = undefined;

}