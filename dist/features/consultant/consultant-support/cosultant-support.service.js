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
exports.ConsultantSupportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const consultant_support_entity_1 = require("../../../shared/entities/consultant_support.entity");
const typeorm_2 = require("typeorm");
let ConsultantSupportService = class ConsultantSupportService {
    constructor(consultantSupportRepository) {
        this.consultantSupportRepository = consultantSupportRepository;
    }
    async create(UserId, createConsultantSupportDto) {
        const consultantSupport = await this.consultantSupportRepository.create({
            id_consultant: UserId,
            ...createConsultantSupportDto,
        });
        console.log(consultantSupport);
        try {
            return await this.consultantSupportRepository.save(consultantSupport);
        }
        catch (error) {
            throw new common_1.HttpException('Não foi possível criar registro', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    findAll() {
        return this.consultantSupportRepository.find();
    }
    async findOne(id) {
        const consultantSupport = await this.consultantSupportRepository.findOne({
            where: { id: id },
        });
        console.log(consultantSupport);
        if (!consultantSupport) {
            throw new common_1.NotFoundException(`Consultant support ID: ${id} not found`);
        }
        return consultantSupport;
    }
    async findAllByUserId(userId) {
        const consultantSupport = await this.consultantSupportRepository.find({
            where: { id_consultant: userId },
        });
        if (!consultantSupport.length) {
            throw new common_1.NotFoundException(`No customer support records found for user ID: ${userId}`);
        }
        return consultantSupport;
    }
    async update(id, _updateCustomerSupportDto) {
        const consultantSupport = await this.consultantSupportRepository.preload({
            ..._updateCustomerSupportDto,
            id: id,
        });
        return this.consultantSupportRepository.save(consultantSupport);
    }
    async remove(id) {
        const customerSupport = await this.consultantSupportRepository.findOne({
            where: { id: +id },
        });
        if (!customerSupport) {
            throw new common_1.NotFoundException(`Customer support ID: ${id} not found`);
        }
        return this.consultantSupportRepository.remove(customerSupport);
    }
};
exports.ConsultantSupportService = ConsultantSupportService;
exports.ConsultantSupportService = ConsultantSupportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(consultant_support_entity_1.ConsultantSupport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConsultantSupportService);
//# sourceMappingURL=cosultant-support.service.js.map