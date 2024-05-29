import { RegistrationMethodEnum } from "src/modules/users/models/enums/registration-method.enum";

export type LocalRegisterParams = {

    readonly email: string;
    readonly username: string;
    readonly registrationMethod: RegistrationMethodEnum;
    password: string;

}