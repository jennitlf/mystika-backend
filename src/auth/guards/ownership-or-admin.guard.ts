import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomerSupportService } from 'src/features/customer/customer-support/customer-support.service';

@Injectable()
export class OwnershipOrAdminGuard implements CanActivate {
  constructor(
    private readonly customerSupportService: CustomerSupportService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const id = request.params.id;

    if (user.role === 'adm') {
      return true;
    }

    const record = await this.customerSupportService.findOne(id);
    if (!record) {
      throw new NotFoundException('Registro não encontrado');
    }

    if (record.id_customer !== user.id) {
      throw new ForbiddenException(
        'Acesso negado: registro não pertence a você.',
      );
    }

    return true;
  }
}
