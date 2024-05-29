import { RegistrationMethodEnum } from "../../enums/registration-method.enum";

export type GetUsersQueryParams = {
 
    readonly username?: string;
    readonly registrationMethod?: RegistrationMethodEnum;
    
}