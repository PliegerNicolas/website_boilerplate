import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ServerRole } from "src/modules/users/models/enums/role.enum";

export class UserPayloadDto {

    @ApiProperty({ description: 'Uuid.' })
    @IsNotEmpty()
    @IsUUID()
    readonly uuid: string;

    @ApiProperty({ description: 'Username.' })
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @ApiProperty({ description: 'Role.' })
    @IsNotEmpty()
    @IsEnum(ServerRole)
    readonly serverRole: ServerRole;

}