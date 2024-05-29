import { IsEnum, IsOptional, IsString } from "class-validator";
import { RegistrationMethodEnum } from "../../enums/registration-method.enum";
import { ApiProperty } from "@nestjs/swagger";

export class GetUsersQueryDto {
 
    @ApiProperty({ description: 'Prefix of username to filter with', required: false })
    @IsOptional()
    @IsString()
    readonly username?: string;

    @ApiProperty({ description: 'Prefix of registrationMethod to filter with', required: false })
    @IsOptional()
    @IsEnum(RegistrationMethodEnum)
    readonly registrationMethod?: RegistrationMethodEnum;
    
}