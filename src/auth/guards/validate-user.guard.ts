import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class ValidateUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Usuário não autenticado.');
    }

    if (user.role !== 'user') {
      throw new ForbiddenException(
        'Acesso negado: Apenas usuários podem criar suporte.',
      );
    }

    return true;
  }
}
