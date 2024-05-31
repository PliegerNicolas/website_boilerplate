import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RoleEnum } from "../../enums/role.enum";

export class GetUsersQueryDto {
 
    @ApiProperty({ description: 'Prefix of username to filter with', required: false })
    @IsOptional()
    @IsString()
    readonly username?: string;

    @ApiProperty({ description: 'Prefix of role to filter with', required: false })
    @IsOptional()
    @IsEnum(RoleEnum)
    readonly role?: RoleEnum;
    
}