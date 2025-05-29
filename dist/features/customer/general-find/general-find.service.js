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
exports.GeneralFindService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const consultant_entity_1 = require("../../../shared/entities/consultant.entity");
const specialty_entity_1 = require("../../../shared/entities/specialty.entity");
const consultant_specialty_entity_1 = require("../../../shared/entities/consultant_specialty.entity");
let GeneralFindService = class GeneralFindService {
    constructor(consultantRepository, specialtyRepository, ConsultantSpecialtyRepository) {
        this.consultantRepository = consultantRepository;
        this.specialtyRepository = specialtyRepository;
        this.ConsultantSpecialtyRepository = ConsultantSpecialtyRepository;
    }
    async generalConsultantData(page = 1, limit = 6, name, specialties, minValue, maxValue) {
        page = isNaN(page) ? 1 : page;
        limit = isNaN(limit) ? 9 : limit;
        if (specialties && !Array.isArray(specialties)) {
            specialties = [specialties];
        }
        const skip = (page - 1) * limit;
        const query = this.consultantRepository
            .createQueryBuilder('consultant')
            .innerJoinAndSelect('consultant.consultantSpecialties', 'consultantSpecialty')
            .innerJoinAndSelect('consultantSpecialty.specialty', 'specialty')
            .select([
            'consultant.id as consultant_id',
            'consultant.name as consultant_name',
            'consultant.profile_data as consultant_profile',
            'consultant.image_consultant as img',
            'consultant.status as status',
            'consultantSpecialty.duration as duration',
            'consultantSpecialty.value_per_duration as value_per_duration',
            'specialty.id as id_specialty',
            'specialty.name_specialty as specialty_name',
        ])
            .where('consultant.status = :status', { status: 'ativo' });
        if (name) {
            query.andWhere('LOWER(consultant.name) LIKE :name', {
                name: `%${name.toLowerCase()}%`,
            });
        }
        if (minValue !== undefined) {
            query.andWhere('consultantSpecialty.value_per_duration >= :minValue', {
                minValue,
            });
        }
        if (maxValue !== undefined) {
            query.andWhere('consultantSpecialty.value_per_duration <= :maxValue', {
                maxValue,
            });
        }
        if (specialties && specialties.length > 0) {
            if (!Array.isArray(specialties)) {
                throw new Error('The "specialties" parameter must be an array.');
            }
            query.andWhere('specialty.name_specialty IN (:...specialties)', {
                specialties,
            });
        }
        const consultants = await query.getRawMany();
        const groupedConsultants = consultants.reduce((acc, item) => {
            let consultant = acc.find((c) => c.consultant_id === item.consultant_id);
            if (!consultant) {
                consultant = {
                    consultant_id: item.consultant_id,
                    consultant_name: item.consultant_name,
                    img: item.img,
                    consultant_profile: item.consultant_profile,
                    status: item.status,
                    specialties: [],
                };
                acc.push(consultant);
            }
            consultant.specialties.push({
                id: item.id,
                name: item.specialty_name,
                duration: item.duration,
                value_per_duration: item.value_per_duration,
            });
            return acc;
        }, []);
        const paginatedData = groupedConsultants.slice(skip, skip + limit);
        return {
            data: paginatedData,
            meta: {
                total: groupedConsultants.length,
                page,
                lastPage: Math.ceil(groupedConsultants.length / limit),
            },
        };
    }
};
exports.GeneralFindService = GeneralFindService;
exports.GeneralFindService = GeneralFindService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(consultant_entity_1.Consultant)),
    __param(1, (0, typeorm_1.InjectRepository)(specialty_entity_1.Specialty)),
    __param(2, (0, typeorm_1.InjectRepository)(consultant_specialty_entity_1.ConsultantSpecialty)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GeneralFindService);
function where(arg0, arg1) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=general-find.service.js.map