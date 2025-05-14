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
    const userIdFromRoute = request.params.id;

    if (user.role !== 'admin' && user.id !== userIdFromRoute) {
      throw new ForbiddenException(
        'Acesso negado: Você só pode acessar os seus próprios dados.',
      );
    }
    return true;
  }
}
