import { Repository } from 'typeorm';
import { Consultant } from 'src/shared/entities/consultant.entity';
import { Specialty } from 'src/shared/entities/specialty.entity';
import { ConsultantSpecialty } from 'src/shared/entities/consultant_specialty.entity';
export declare class GeneralFindService {
    private readonly consultantRepository;
    private readonly specialtyRepository;
    private readonly ConsultantSpecialtyRepository;
    constructor(consultantRepository: Repository<Consultant>, specialtyRepository: Repository<Specialty>, ConsultantSpecialtyRepository: Repository<ConsultantSpecialty>);
    generalConsultantData(page?: number, limit?: number, name?: string, specialties?: string[], minValue?: number, maxValue?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            lastPage: number;
        };
    }>;
}
