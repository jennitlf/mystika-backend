import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomerSupportService } from 'src/features/customer/customer-support/customer-support.service';
import { ConsultationService } from 'src/features/customer/consultation/consultation.service';

@Injectable()
export class OwnershipOrAdminGuard implements CanActivate {
  constructor(
    private readonly customerSupportService: CustomerSupportService,
    private readonly consultationService: ConsultationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const id = request.params.id;

    if (user.role === 'adm') {
      return true;
    }
    if (request.originalUrl.includes('/customer-support/record/')) {
      const record = await this.customerSupportService.findOne(id);
      if (!record) {
        throw new NotFoundException('Registro não encontrado');
      }
      if (record.id_customer !== user.id) {
        throw new ForbiddenException(
          'Acesso negado: registro não pertence a você.',
        );
      }
    } else if (
      user.role === 'consultant' &&
      request.originalUrl.includes('/consultation') &&
      request.method === 'PUT'
    ) {
      console.log('estou no parametro de entrada');
      const consultations =
        await this.consultationService.findByIdConsultation(id);
      if (
        !consultations ||
        !consultations.data ||
        consultations.data.length === 0
      ) {
        throw new NotFoundException('Consulta não encontrada');
      }
      const consultation = consultations.data[0];
      if (
        consultation.schedule_consultant.consultant_specialty.consultant.id !==
        user.id
      ) {
        throw new ForbiddenException(
          'Acesso negado: consulta não pertence a você.',
        );
      }
    } else if (
      user.role === 'user' &&
      request.originalUrl.includes('/consultation') &&
      request.method === 'PUT'
    ) {
      const consultations =
        await this.consultationService.findByIdConsultation(id);
      if (
        !consultations ||
        !consultations.data ||
        consultations.data.length === 0
      ) {
        throw new NotFoundException('Consulta não encontrada');
      }
      const consultation = consultations.data[0];
      if (consultation.customer.id !== user.id) {
        throw new ForbiddenException(
          'Acesso negado: consulta não pertence a você.',
        );
      }
    } else {
      return true;
    }

    return true;
  }
}
