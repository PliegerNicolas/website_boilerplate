import { IsEnum, IsOptional, IsString } from "class-validator";
import { RegistrationMethod } from "../../enums/registration-method.enum";
import { ApiProperty } from "@nestjs/swagger";

export class GetUsersQueryDto {
 
    @ApiProperty({ description: 'Prefix of displayName to filter with.', required: false })
    @IsOptional()
    @IsString()
    readonly displayName?: string;

    @ApiProperty({ description: 'Prefix of registrationMethod to filter with.', required: false })
    @IsOptional()
    @IsEnum(RegistrationMethod)
    readonly registrationMethod?: RegistrationMethod;
    
}