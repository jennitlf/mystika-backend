import { CustomerAuthService } from './customer-auth.service';
import { CreateCustomerDto } from 'src/shared/dtos/create-customer.dto';
export declare class CustomerAuthController {
    private readonly customerAuthService;
    constructor(customerAuthService: CustomerAuthService);
    register(req: Request, body: CreateCustomerDto): Promise<any>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
