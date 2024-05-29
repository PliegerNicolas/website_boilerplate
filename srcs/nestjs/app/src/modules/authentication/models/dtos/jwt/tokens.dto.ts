import { IsDate, IsDefined, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { JwtTokenEnum } from "../../enums/jwt-tokens.enum";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class JwtTokensDto {

    @ApiProperty({ description: 'Access token' })
    @IsDefined()
    @ValidateNested()
    @Type(() => JwtTokenDto)
    readonly accessToken: string | undefined;

    @ApiProperty({ description: 'Refresh token' })
    @IsDefined()
    @ValidateNested()
    @Type(() => JwtTokenDto)
    readonly refreshToken: string | undefined;

};

export class JwtTokenDto {

    @ApiProperty({ description: 'Token type/name' })
    @IsNotEmpty()
    @IsEnum(JwtTokenEnum)
    readonly name: JwtTokenEnum;

    @ApiProperty({ description: 'Token value' })
    @IsNotEmpty()
    @IsString()
    readonly value: string;

    @ApiProperty({ description: 'Token\'s expiration date' })
    @IsNotEmpty()
    @IsDate()
    expiresIn: Date;

}