import { Adm } from './adm.entity';
import { Customer } from './customer.entity';
export declare class CustomerSupport {
    id: number;
    id_customer: number;
    email: string;
    phone: string;
    title: string;
    content: string;
    status: string;
    admResponsible: Adm;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    adm: Adm[];
}
