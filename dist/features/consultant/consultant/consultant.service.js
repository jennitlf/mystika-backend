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
exports.ConsultantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const consultant_entity_1 = require("../../../shared/entities/consultant.entity");
let ConsultantService = class ConsultantService {
    constructor(consultantRepository) {
        this.consultantRepository = consultantRepository;
    }
    create(createConsultantDto) {
        const consultant = this.consultantRepository.create(createConsultantDto);
        return this.consultantRepository.save(consultant);
    }
    async findAll(page = 1, limit = 10) {
        page = isNaN(page) ? 1 : page;
        limit = isNaN(limit) ? 10 : limit;
        const skip = (page - 1) * limit;
        const [data, total] = await this.consultantRepository.findAndCount({
            skip,
            take: limit,
            order: { created_at: 'DESC' },
        });
        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }
    async findByEmail(email) {
        const consultant = await this.consultantRepository.findOne({
            where: { email: email },
        });
        if (!consultant) {
            throw new common_1.HttpException('Usuário não cadastrado', common_1.HttpStatus.BAD_REQUEST);
        }
        return consultant;
    }
    async findByEmailforRegister(email) {
        const consultant = await this.consultantRepository.findOne({
            where: { email: email },
        });
        if (!consultant) {
            return null;
        }
        return consultant;
    }
    async findByCpf(cpf) {
        const consultant = await this.consultantRepository.findOne({
            where: { cpf: cpf },
        });
        if (!consultant) {
            return null;
        }
        return consultant;
    }
    async findOne(id) {
        const consultant = await this.consultantRepository.findOne({
            where: { id: +id },
        });
        if (!consultant) {
            throw new common_1.NotFoundException(`consultant ID: ${id} not found`);
        }
        return consultant;
    }
    async update(id, updateConsultantDto) {
        const consultant = await this.consultantRepository.preload({
            ...updateConsultantDto,
            id: +id,
        });
        if (!consultant) {
            throw new common_1.NotFoundException(`Consultant ID: ${id} not found`);
        }
        return this.consultantRepository.save(consultant);
    }
    async remove(id) {
        const consultant = await this.consultantRepository.findOne({
            where: { id: +id },
        });
        if (!consultant) {
            throw new common_1.NotFoundException(`Consultant ID: ${id} not found`);
        }
        return this.consultantRepository.remove(consultant);
    }
};
exports.ConsultantService = ConsultantService;
exports.ConsultantService = ConsultantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(consultant_entity_1.Consultant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConsultantService);
//# sourceMappingURL=consultant.service.js.map