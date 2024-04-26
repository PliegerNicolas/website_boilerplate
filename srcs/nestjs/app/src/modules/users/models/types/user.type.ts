import { RegistrationMethod } from "../enums/registration-method.enum";

export type CreateUserParams = {
    email: string;
    displayName: string;
    registrationMethod: RegistrationMethod,
    password: string;
}

export type ReplaceUserParams = {
    email: string;
    displayName: string;
    registrationMethod: RegistrationMethod,
    password?: string;
}

export type UpdateUserParams = {
    email?: string;
    displayName?: string;
    registrationMethod?: RegistrationMethod,
    password?: string;
}