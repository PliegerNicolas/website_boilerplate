import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UserPayloadDto {

    @ApiProperty({ description: 'Uuid' })
    @IsNotEmpty()
    @IsUUID()
    readonly uuid: string;

    @ApiProperty({ description: 'Username' })
    @IsNotEmpty()
    @IsString()
    readonly username: string;

}