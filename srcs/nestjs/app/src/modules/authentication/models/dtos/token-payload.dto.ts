import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UserPayloadDto {

    @ApiProperty({ description: 'User\'s UUID.' })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    readonly uuid: string;

    @ApiProperty({ description: 'Display name of the user. In other words it\s username.' })
    @IsNotEmpty()
    @IsString()
    readonly displayName: string;

}