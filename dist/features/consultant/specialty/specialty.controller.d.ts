import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto } from 'src/shared/dtos/create-specialty.dto';
import { UpdateSpecialtyDto } from 'src/shared/dtos/update-specialty.dto';
export declare class SpecialtyController {
    private readonly specialtyService;
    constructor(specialtyService: SpecialtyService);
    create(createSpecialtyDto: CreateSpecialtyDto): Promise<import("../../../shared/entities/specialty.entity").Specialty[]>;
    findAll(): Promise<import("../../../shared/entities/specialty.entity").Specialty[]>;
    findOne(id: string): Promise<import("../../../shared/entities/specialty.entity").Specialty>;
    update(id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<import("../../../shared/entities/specialty.entity").Specialty>;
    remove(id: string): Promise<import("../../../shared/entities/specialty.entity").Specialty>;
}
