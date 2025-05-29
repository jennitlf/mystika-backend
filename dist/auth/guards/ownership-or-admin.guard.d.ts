import { CanActivate, ExecutionContext } from '@nestjs/common';
import { CustomerSupportService } from 'src/features/customer/customer-support/customer-support.service';
export declare class OwnershipOrAdminGuard implements CanActivate {
    private readonly customerSupportService;
    constructor(customerSupportService: CustomerSupportService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
