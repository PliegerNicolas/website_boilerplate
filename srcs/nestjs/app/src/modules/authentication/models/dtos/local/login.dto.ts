import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LocalLoginDto {

    @ApiProperty({ description: 'Username' })
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @ApiProperty({ description: 'Password' })
    @IsNotEmpty()
    @IsString()
    readonly password: string;

}