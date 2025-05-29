import { ConsultantService } from './consultant.service';
import { CreateConsultantDto } from 'src/shared/dtos/create-consultant.dto';
import { UpdateConsultantDto } from 'src/shared/dtos/update-consultant.dto';
export declare class ConsultantController {
    private readonly consultantService;
    constructor(consultantService: ConsultantService);
    create(createConsultantDto: CreateConsultantDto): Promise<import("../../../shared/entities/consultant.entity").Consultant[]>;
    findAll(page?: number, limit?: number): Promise<{
        data: import("../../../shared/entities/consultant.entity").Consultant[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<import("../../../shared/entities/consultant.entity").Consultant>;
    update(id: string, updateConsultantDto: UpdateConsultantDto): Promise<import("../../../shared/entities/consultant.entity").Consultant>;
    remove(id: string): Promise<import("../../../shared/entities/consultant.entity").Consultant>;
}
