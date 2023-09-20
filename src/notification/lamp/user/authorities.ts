import { SetMetadata } from '@nestjs/common';

export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export const Authorities: Role[] = ['ROLE_USER', 'ROLE_ADMIN'];

export const Roles = (roles: Role[]): any => SetMetadata('roles', roles);
