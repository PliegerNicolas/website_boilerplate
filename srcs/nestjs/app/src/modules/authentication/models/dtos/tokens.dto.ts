import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginJwtTokensDto {

    @ApiProperty({ description: 'JWT access token.' })
    @IsNotEmpty()
    @IsString()
    readonly accessToken: string;

    @ApiProperty({ description: 'JWT refresh token.' })
    @IsNotEmpty()
    @IsString()
    readonly refreshToken: string;

}