import { RegistrationProvider } from "../../enums/registration-provider.enum";

export type RegistrationMethodParams = {

    readonly provider: RegistrationProvider;
    readonly identifier: string;

}