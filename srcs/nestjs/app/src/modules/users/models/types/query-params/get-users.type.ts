import { RegistrationMethod } from "../../enums/registration-method.enum";

export type GetUsersQueryParams = {
 
    readonly displayName?: string;
    readonly registrationMethod?: RegistrationMethod;
    
}