import { Repository } from 'typeorm';
import { Specialty } from 'src/shared/entities/specialty.entity';
export declare class SpecialtyService {
    private readonly specialtyRepository;
    constructor(specialtyRepository: Repository<Specialty>);
    create(createSpecialtyDto: any): Promise<Specialty[]>;
    findAll(): Promise<Specialty[]>;
    findOne(id: string): Promise<Specialty>;
    update(id: string, updateSpecialtyDto: any): Promise<Specialty>;
    remove(id: string): Promise<Specialty>;
}
