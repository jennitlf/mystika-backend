import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConsultantSupportService } from 'src/features/consultant/consultant-support/cosultant-support.service';
export declare class OwnershipConsultantOrAdminGuard implements CanActivate {
    private readonly ConsultantSupportService;
    constructor(ConsultantSupportService: ConsultantSupportService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
