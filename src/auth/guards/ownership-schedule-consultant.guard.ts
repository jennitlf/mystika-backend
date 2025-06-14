import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
import { ConsultantSpecialtyService } from 'src/features/consultant/consultant-specialty/consultant-specialty.service';
  
  @Injectable()
  export class OwnershipScheduleConsultant implements CanActivate {
    constructor(
        private readonly consultantSpecialty: ConsultantSpecialtyService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const consultant = request.user;

      if (consultant.role === 'adm') {
        // eslint-disable-next-line prettier/prettier
        return
      }
      const body = request.body;
      const consultantSpecialty = await this.consultantSpecialty.findOne(body.id_consultant_specialty);
      
      if (consultantSpecialty.id_consultant === consultant.id) {
        return true;
      }else {
        throw new ForbiddenException(
            'Acesso negado: Você só pode acessar os seus próprios dados.',
          ); 
      }
    }
  }
  