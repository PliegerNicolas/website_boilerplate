import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { RegistrationProvider } from "../../enums/registration-provider.enum";

export class RegistrationMethodDto {

    @ApiProperty({ description: 'Registration provider (local, google, facebook ...)' })
    @IsNotEmpty()
    @IsEnum(RegistrationProvider)
    readonly provider: RegistrationProvider;

    @ApiProperty({ description: 'Unique identifier. (password, uuid...)' })
    @IsNotEmpty()
    @IsString()
    readonly identifier: string;

}