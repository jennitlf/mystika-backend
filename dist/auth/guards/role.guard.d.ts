import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class RoleGuard implements CanActivate {
    private requiredRoles;
    constructor(requiredRoles: string[]);
    canActivate(context: ExecutionContext): boolean;
}
