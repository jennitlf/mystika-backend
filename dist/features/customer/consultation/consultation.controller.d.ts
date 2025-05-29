import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from 'src/shared/dtos/create-consultation.dto';
import { UpdateConsultationDto } from 'src/shared/dtos/update-consultation.dto';
export declare class ConsultationController {
    private readonly consultationService;
    constructor(consultationService: ConsultationService);
    create(req: any, createConsultationDto: CreateConsultationDto): Promise<import("../../../shared/entities/consultation.entity").Consultation[]>;
    findAll(idCustomer?: number, idConsultantSpecialty?: number, appoinmentDate?: string, appoinmentTime?: string, page?: number, limit?: number): Promise<{
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
    findOne(req: any): Promise<{
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
    update(req: any, updateConsultationDto: UpdateConsultationDto): Promise<import("../../../shared/entities/consultation.entity").Consultation>;
    remove(req: any): Promise<import("../../../shared/entities/consultation.entity").Consultation>;
}
