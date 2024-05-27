import { RegistrationMethod } from "../enums/registration-method.enum";

export type CreateUserParams = {
    readonly email: string;
    readonly displayName: string;
    readonly registrationMethod: RegistrationMethod,
    readonly password: string | undefined;
}

export type ReplaceUserParams = {
    readonly email: string;
    readonly displayName: string;
    readonly registrationMethod: RegistrationMethod,
    readonly password: string | undefined;
}

export type UpdateUserParams = {
    readonly email?: string;
    readonly displayName?: string;
    readonly registrationMethod?: RegistrationMethod,
    readonly password?: string | undefined;
}