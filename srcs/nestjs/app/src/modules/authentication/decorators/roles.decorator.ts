import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/modules/users/models/enums/role.enum';

export const ROLE_KEY = 'role';

export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLE_KEY, roles);