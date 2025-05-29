import { Consultation } from './consultation.entity';
import { CustomerSupport } from './customer_support.entity';
export declare class Customer {
    id: number;
    name: string;
    phone: string;
    email: string;
    password: string;
    status: string;
    role: string;
    created_at: Date;
    updated_at: Date;
    consultation: Consultation[];
    customerSupport: CustomerSupport[];
}
