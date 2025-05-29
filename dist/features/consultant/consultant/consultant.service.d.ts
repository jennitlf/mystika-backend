import { Repository } from 'typeorm';
import { Consultant } from 'src/shared/entities/consultant.entity';
export declare class ConsultantService {
    private readonly consultantRepository;
    constructor(consultantRepository: Repository<Consultant>);
    create(createConsultantDto: any): Promise<Consultant[]>;
    findAll(page?: number, limit?: number): Promise<{
        data: Consultant[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    findByEmail(email: string): Promise<Consultant>;
    findByEmailforRegister(email: string): Promise<Consultant>;
    findByCpf(cpf: string): Promise<Consultant>;
    findOne(id: string): Promise<Consultant>;
    update(id: string, updateConsultantDto: any): Promise<Consultant>;
    remove(id: string): Promise<Consultant>;
}
