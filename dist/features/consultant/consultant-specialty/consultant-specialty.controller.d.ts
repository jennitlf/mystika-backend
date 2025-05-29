import { ConsultantSpecialtyService } from './consultant-specialty.service';
import { CreateConsultantSpecialtyDto } from 'src/shared/dtos/create-consultant-specialty.dto';
import { UpdateConsultantSpecialtyDto } from 'src/shared/dtos/update-consultant-specialty.dto';
export declare class ConsultantSpecialtyController {
    private readonly consultantSpecialtyService;
    constructor(consultantSpecialtyService: ConsultantSpecialtyService);
    create(createConsultantSpecialtyDto: CreateConsultantSpecialtyDto): Promise<import("../../../shared/entities/consultant_specialty.entity").ConsultantSpecialty[]>;
    findAll(consultantName?: string, idConsultant?: number, specialty?: string, minPrice?: number, maxPrice?: number, page?: number, limit?: number): Promise<{
        data: import("../../../shared/entities/consultant_specialty.entity").ConsultantSpecialty[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<import("../../../shared/entities/consultant_specialty.entity").ConsultantSpecialty>;
    update(id: string, updateConsultantSpecialtyDto: UpdateConsultantSpecialtyDto): Promise<import("../../../shared/entities/consultant_specialty.entity").ConsultantSpecialty>;
    remove(id: string): Promise<import("../../../shared/entities/consultant_specialty.entity").ConsultantSpecialty>;
}
