import { Repository } from 'typeorm';
import { ConsultantSpecialty } from 'src/shared/entities/consultant_specialty.entity';
export declare class ConsultantSpecialtyService {
    private readonly consultantSpecialtyRepository;
    constructor(consultantSpecialtyRepository: Repository<ConsultantSpecialty>);
    create(createConsultantSpecialtyDto: any): Promise<ConsultantSpecialty[]>;
    findConsultantsByFilters(filters: {
        consultantName?: string;
        idConsultant?: number;
        specialty?: string;
        minPrice?: number;
        maxPrice?: number;
    }, page?: number, limit?: number): Promise<{
        data: ConsultantSpecialty[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<ConsultantSpecialty>;
    update(id: string, updateConsultantSpecialtyDto: any): Promise<ConsultantSpecialty>;
    remove(id: string): Promise<ConsultantSpecialty>;
}
