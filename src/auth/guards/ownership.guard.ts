import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userIdFromRoute = parseInt(request.params.id, 10);

    if (user.role === 'adm') {
      return true;
    }

    if (
      (user.role === 'consultant' || user.role === 'user') &&
      user.id === userIdFromRoute
    ) {
      return true;
    }

    throw new ForbiddenException(
      'Acesso negado: Você só pode acessar os seus próprios dados.',
    );
  }
}
