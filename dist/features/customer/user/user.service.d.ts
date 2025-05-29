import { Repository } from 'typeorm';
import { Customer } from 'src/shared/entities/customer.entity';
export declare class UserService {
    private readonly customerRepository;
    constructor(customerRepository: Repository<Customer>);
    create(createUserDto: any): Promise<Customer[]>;
    findAll(): Promise<Customer[]>;
    findByEmail(email: string): Promise<Customer>;
    findByEmailforRegister(email: string): Promise<Customer>;
    findOne(id: string): Promise<Customer>;
    update(id: number, updateUserDto: any): Promise<Customer>;
    remove(id: string): Promise<Customer>;
}
