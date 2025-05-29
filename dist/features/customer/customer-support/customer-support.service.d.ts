import { CreateCustomerSupportDto } from 'src/shared/dtos/create-customer-support.dto';
import { CustomerSupport } from 'src/shared/entities/customer_support.entity';
import { Repository } from 'typeorm';
export declare class CustomerSupportService {
    private readonly customerSupportRepository;
    constructor(customerSupportRepository: Repository<CustomerSupport>);
    create(dataUser: any, createCustomerSupportDto: CreateCustomerSupportDto): Promise<CustomerSupport>;
    findAll(): Promise<CustomerSupport[]>;
    findOne(id: number): Promise<CustomerSupport>;
    findAllByUserId(userId: number): Promise<CustomerSupport[]>;
    update(id: number, _updateCustomerSupportDto: any): Promise<CustomerSupport>;
    remove(id: number): Promise<CustomerSupport>;
}
