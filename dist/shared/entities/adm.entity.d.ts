import { ConsultantSupport } from './consultant_support.entity';
import { CustomerSupport } from './customer_support.entity';
export declare class Adm {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    consultantSupport: ConsultantSupport[];
    customerSupport: CustomerSupport[];
}
