import { RoleGuard } from '../guards/role.guard';

export function createRoleGuard(roles: string[]) {
  return new RoleGuard(roles);
}