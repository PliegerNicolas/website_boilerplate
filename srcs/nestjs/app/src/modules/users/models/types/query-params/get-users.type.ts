import { ServerRole } from "../../enums/role.enum";

export type GetUsersQueryParams = {
 
    readonly username?: string;
    readonly serverRole?: ServerRole;
    
}