import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private requiredRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !this.requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Acesso negado: Permissão insuficiente.');
    }
    return true;
  }
}