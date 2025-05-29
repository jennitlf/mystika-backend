import { CustomerSupportService } from './customer-support.service';
import { CreateCustomerSupportDto } from '../../../shared/dtos/create-customer-support.dto';
import { UpdateCustomerSupportDto } from '../../../shared/dtos/update-customer-support.dto';
export declare class CustomerSupportController {
    private readonly customerSupportService;
    constructor(customerSupportService: CustomerSupportService);
    create(req: any, createCustomerSupportDto: CreateCustomerSupportDto): Promise<import("../../../shared/entities/customer_support.entity").CustomerSupport>;
    findAll(): Promise<import("../../../shared/entities/customer_support.entity").CustomerSupport[]>;
    findAllByUser(req: any): Promise<import("../../../shared/entities/customer_support.entity").CustomerSupport[]>;
    findOne(id: string): Promise<import("../../../shared/entities/customer_support.entity").CustomerSupport>;
    update(id: string, updateCustomerSupportDto: UpdateCustomerSupportDto): Promise<import("../../../shared/entities/customer_support.entity").CustomerSupport>;
    remove(id: string): Promise<import("../../../shared/entities/customer_support.entity").CustomerSupport>;
}
