import { Consultation } from 'src/shared/entities/consultation.entity';
import { Repository } from 'typeorm';
export declare class ConsultationService {
    private readonly consultationRepository;
    constructor(consultationRepository: Repository<Consultation>);
    create(dataUser: any, createConsultationDto: any): Promise<Consultation[]>;
    findAll(filters: {
        idCustomer?: number;
        idConsultantSpecialty?: number;
        appoinmentDate?: string;
        appoinmentTime?: string;
    }, page?: number, limit?: number): Promise<{
        data: {
            id: number;
            customer: {
                id: number;
                name: string;
            };
            schedule_consultant: {
                id: number;
                consultant_specialty: {
                    id: number;
                    consultant: {
                        id: number;
                        name: string;
                    };
                    specialty: {
                        id: number;
                        name_specialty: string;
                    };
                    value_per_duration: number;
                    duration: number;
                };
            };
            appoinment_date: Date;
            appoinment_time: string;
            status: string;
        }[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    findOne(dataUser: number): Promise<{
        data: {
            id: number;
            customer: {
                id: number;
                name: string;
            };
            schedule_consultant: {
                id: number;
                consultant_specialty: {
                    id: number;
                    consultant: {
                        id: number;
                        name: string;
                    };
                    specialty: {
                        id: number;
                        name_specialty: string;
                    };
                    value_per_duration: number;
                    duration: number;
                };
            };
            appoinment_date: Date;
            appoinment_time: string;
            status: string;
            attended: string;
            created_at: Date;
            updated_at: Date;
        }[];
    }>;
    update(id: string, updateConsultationDto: any): Promise<Consultation>;
    remove(id: string): Promise<Consultation>;
}
