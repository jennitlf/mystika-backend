import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { ConsultantSupportService } from 'src/features/consultant/consultant-support/cosultant-support.service';
  
  @Injectable()
  export class OwnershipConsultantOrAdminGuard implements CanActivate {
    constructor(
      private readonly ConsultantSupportService: ConsultantSupportService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const id = request.params.id;
      
      if (user.role === 'adm') {
        return true;
      }
      if(request.originalUrl.includes('/consultant-support/record')) {
        const record = await this.ConsultantSupportService.findOne(id);
        if (!record) {
          throw new NotFoundException('Registro não encontrado');
        }
        if (record.id_consultant !== user.id) {
          throw new ForbiddenException(
            'Acesso negado: registro não pertence a você.',
          );
        }
      }else{
        return true
      }
  
      return true;
    }
  }
  