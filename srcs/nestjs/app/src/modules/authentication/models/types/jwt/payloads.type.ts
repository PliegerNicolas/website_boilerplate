import { ServerRole } from "src/modules/users/models/enums/role.enum";

export type UserPayloadParams = {

    readonly uuid: string;
    readonly username: string;
    readonly serverRole: ServerRole;

}