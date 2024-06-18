import { SetMetadata } from '@nestjs/common';
import { ServerRole } from 'src/modules/users/models/enums/role.enum';

export const SERVER_ROLE_KEY = 'ServerRole';

export const ServerRoles = (...serverRoles: ServerRole[]) => SetMetadata(SERVER_ROLE_KEY, serverRoles);