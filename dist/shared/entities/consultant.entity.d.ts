import { ConsultantSpecialty } from './consultant_specialty.entity';
import { ConsultantSupport } from './consultant_support.entity';
export declare class Consultant {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    email: string;
    password: string;
    profile_data: string;
    image_consultant: string;
    status: string;
    payment_plan: string;
    appellant: boolean;
    about_specialties: string;
    consultants_story: string;
    consultations_carried_out: number;
    role: string;
    created_at: Date;
    updated_at: Date;
    consultantSpecialties: ConsultantSpecialty[];
    consultantSupport: ConsultantSupport[];
}
