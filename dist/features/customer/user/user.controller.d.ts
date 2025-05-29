import { UserService } from './user.service';
import { CreateCustomerDto } from 'src/shared/dtos/create-customer.dto';
import { UpdateCostumerDto } from 'src/shared/dtos/update-customer.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createCostumerDto: CreateCustomerDto): Promise<import("../../../shared/entities/customer.entity").Customer[]>;
    findAll(): Promise<import("../../../shared/entities/customer.entity").Customer[]>;
    findByEmail(email: string): Promise<import("../../../shared/entities/customer.entity").Customer>;
    findOne(id: string): Promise<import("../../../shared/entities/customer.entity").Customer>;
    update(id: string, updateCostumerDto: UpdateCostumerDto): Promise<import("../../../shared/entities/customer.entity").Customer>;
    remove(id: string): Promise<import("../../../shared/entities/customer.entity").Customer>;
}
