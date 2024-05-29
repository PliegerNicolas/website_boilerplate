import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { RegistrationMethodEnum } from "src/modules/users/models/enums/registration-method.enum";

export class LocalRegisterDto {

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
    readonly registrationMethod: RegistrationMethodEnum = RegistrationMethodEnum.LOCAL;

    @ApiProperty({ description: 'Password' })
    @IsNotEmpty()
    @IsString()
    readonly password: string;

}