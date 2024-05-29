import { RegistrationMethodEnum } from "src/modules/users/models/enums/registration-method.enum"

export type LocalLoginParams = {

    readonly username: string;
    password: string;

}