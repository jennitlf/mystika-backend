"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultantSpecialtyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const consultant_specialty_entity_1 = require("../../../shared/entities/consultant_specialty.entity");
let ConsultantSpecialtyService = class ConsultantSpecialtyService {
    constructor(consultantSpecialtyRepository) {
        this.consultantSpecialtyRepository = consultantSpecialtyRepository;
    }
    create(createConsultantSpecialtyDto) {
        const consultantSpecialty = this.consultantSpecialtyRepository.create(createConsultantSpecialtyDto);
        return this.consultantSpecialtyRepository.save(consultantSpecialty);
    }
    async findConsultantsByFilters(filters, page = 1, limit = 10) {
        const { specialty, minPrice, maxPrice, consultantName, idConsultant } = filters;
        const skip = (page - 1) * limit;
        const query = this.consultantSpecialtyRepository
            .createQueryBuilder('consultantSpecialty')
            .innerJoinAndSelect('consultantSpecialty.consultant', 'consultant')
            .innerJoinAndSelect('consultantSpecialty.specialty', 'specialty');
        if (specialty)
            query.andWhere('specialty.name_specialty = :specialty', { specialty });
        if (minPrice)
            query.andWhere('consultantSpecialty.value_per_duration >= :minPrice', {
                minPrice,
            });
        if (maxPrice)
            query.andWhere('consultantSpecialty.value_per_duration <= :maxPrice', {
                maxPrice,
            });
        if (consultantName) {
            query.andWhere('consultant.name LIKE :consultantName', {
                consultantName: `%${consultantName}%`,
            });
        }
        if (idConsultant)
            query.andWhere('consultant.id = :idConsultant', { idConsultant });
        query.skip(skip).take(limit);
        const [data, total] = await query.getManyAndCount();
        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const consultantSpecialty = await this.consultantSpecialtyRepository.findOne({
            where: { id: +id },
        });
        if (!consultantSpecialty) {
            throw new common_1.NotFoundException(`Consultant Specialty ID: ${id} not found`);
        }
        return consultantSpecialty;
    }
    async update(id, updateConsultantSpecialtyDto) {
        const consultantSpecialty = await this.consultantSpecialtyRepository.preload({
            ...updateConsultantSpecialtyDto,
            id: +id,
        });
        if (!consultantSpecialty) {
            throw new common_1.NotFoundException(`Consultant Specialty ID: ${id} not found`);
        }
        return this.consultantSpecialtyRepository.save(consultantSpecialty);
    }
    async remove(id) {
        const consultant_specialty = await this.consultantSpecialtyRepository.findOne({
            where: { id: +id },
        });
        if (!consultant_specialty) {
            throw new common_1.NotFoundException(`Consultant Specialty ID: ${id} not found`);
        }
        return this.consultantSpecialtyRepository.remove(consultant_specialty);
    }
};
exports.ConsultantSpecialtyService = ConsultantSpecialtyService;
exports.ConsultantSpecialtyService = ConsultantSpecialtyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(consultant_specialty_entity_1.ConsultantSpecialty)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConsultantSpecialtyService);
//# sourceMappingURL=consultant-specialty.service.js.map