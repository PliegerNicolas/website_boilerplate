import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ReplaceUserDto {

    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

}