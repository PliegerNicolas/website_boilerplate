import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LocalUserLoginDto {

    @ApiProperty({ description: 'DisplayName / Username.' })
    @IsNotEmpty()
    @IsString()
    readonly displayName: string;

    @ApiProperty({ description: 'Password.' })
    @IsNotEmpty()
    @IsString()
    readonly password: string;

}