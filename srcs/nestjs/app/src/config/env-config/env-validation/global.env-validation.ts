import { IsNotEmpty, IsString } from 'class-validator';

export class GlobalConfigEnvValidation {

    @IsNotEmpty()
    @IsString()
    domain_name: string;
    
}