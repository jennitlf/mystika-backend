import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private requiredRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    console.log("estou no role.guard");
    const request = context.switchToHttp().getRequest();
    console.log("request user:", request.user);
    const user = request.user;
    console.log("perfil de quem fez a requisição", user.role)
    if (!user || !this.requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Acesso negado: Permissão insuficiente.');
    }
    console.log("saindo do role.guard")
    return true;
  }
}
