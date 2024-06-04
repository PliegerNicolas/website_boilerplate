import { RegistrationMethodParams } from "src/modules/users/models/types/registration-method/registration-method.type";

export type LocalLoginParams = {

    readonly username: string;
    password: string;

}

export type LocalRegisterParams = {

    readonly email: string;
    readonly username: string;
    password: string,

}

export type LocalRegisterAndMethodParams = {

    readonly email: string;
    readonly username: string;
    readonly registrationMethod: RegistrationMethodParams,

}