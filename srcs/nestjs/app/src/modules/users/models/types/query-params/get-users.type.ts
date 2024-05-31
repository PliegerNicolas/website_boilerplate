import { RoleEnum } from "../../enums/role.enum";

export type GetUsersQueryParams = {
 
    readonly username?: string;
    readonly role?: RoleEnum;
    
}