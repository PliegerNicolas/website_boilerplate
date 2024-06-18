import { RegistrationMethodParams } from "../registration-method/registration-method.type";

export type CreateUserParams = {
    readonly email: string;
    readonly username: string;
    readonly registrationMethod: RegistrationMethodParams;
}

export type ReplaceUserParams = {
    readonly email: string;
    readonly username: string;
    password: string;
}

export type UpdateUserParams = {
    readonly email?: string;
    readonly username?: string;
    password?: string;
}