import { Consultant } from './consultant.entity';
import { Adm } from './adm.entity';
export declare class ConsultantSupport {
    id: number;
    id_consultant: number;
    email: string;
    phone: string;
    title: string;
    content: string;
    status: string;
    admResponsible: Adm;
    createdAt: Date;
    updatedAt: Date;
    consultant: Consultant;
    adm: Adm[];
}
