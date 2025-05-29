import { CreateConsultantSupportDto } from 'src/shared/dtos/create-consultant-support.dto';
import { UpdateConsultantSupportDto } from 'src/shared/dtos/update-consultant-support.dto';
import { ConsultantSupport } from 'src/shared/entities/consultant_support.entity';
import { Repository } from 'typeorm';
export declare class ConsultantSupportService {
    private readonly consultantSupportRepository;
    constructor(consultantSupportRepository: Repository<ConsultantSupport>);
    create(UserId: any, createConsultantSupportDto: CreateConsultantSupportDto): Promise<ConsultantSupport>;
    findAll(): Promise<ConsultantSupport[]>;
    findOne(id: number): Promise<ConsultantSupport>;
    findAllByUserId(userId: number): Promise<ConsultantSupport[]>;
    update(id: number, _updateCustomerSupportDto: UpdateConsultantSupportDto): Promise<ConsultantSupport>;
    remove(id: number): Promise<ConsultantSupport>;
}
