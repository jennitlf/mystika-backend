import { ConsultantSupportService } from './cosultant-support.service';
import { CreateConsultantSupportDto } from 'src/shared/dtos/create-consultant-support.dto';
import { UpdateConsultantSupportDto } from 'src/shared/dtos/update-consultant-support.dto';
export declare class ConsultantSupportController {
    private readonly consultantSupportService;
    constructor(consultantSupportService: ConsultantSupportService);
    create(req: any, createConsultantSupportDto: CreateConsultantSupportDto): Promise<import("../../../shared/entities/consultant_support.entity").ConsultantSupport>;
    findAll(): Promise<import("../../../shared/entities/consultant_support.entity").ConsultantSupport[]>;
    findAllByUser(req: any): Promise<import("../../../shared/entities/consultant_support.entity").ConsultantSupport[]>;
    findOne(id: string): Promise<import("../../../shared/entities/consultant_support.entity").ConsultantSupport>;
    update(id: string, updateConsultantSupportDto: UpdateConsultantSupportDto): Promise<import("../../../shared/entities/consultant_support.entity").ConsultantSupport>;
    remove(id: string): Promise<import("../../../shared/entities/consultant_support.entity").ConsultantSupport>;
}
