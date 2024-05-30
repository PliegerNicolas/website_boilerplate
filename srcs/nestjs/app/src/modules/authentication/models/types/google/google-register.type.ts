import { RegistrationMethodEnum } from "src/modules/users/models/enums/registration-method.enum";

export type GoogleRegisterParams = {

    readonly email: string;
    readonly username: string;
    readonly registrationMethod: RegistrationMethodEnum;
    readonly password: undefined;

}