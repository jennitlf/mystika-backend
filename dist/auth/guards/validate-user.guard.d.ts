import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class ValidateUserGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
