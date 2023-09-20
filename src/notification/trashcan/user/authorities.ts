import { SetMetadata } from '@nestjs/common';

export type Role = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_CLEANER';

export const Authorities: Role[] = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_CLEANER'];

export const Roles = (roles: Role[]): any => SetMetadata('roles', roles);
