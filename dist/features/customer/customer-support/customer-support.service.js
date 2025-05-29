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
exports.CustomerSupportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_support_entity_1 = require("../../../shared/entities/customer_support.entity");
const typeorm_2 = require("typeorm");
let CustomerSupportService = class CustomerSupportService {
    constructor(customerSupportRepository) {
        this.customerSupportRepository = customerSupportRepository;
    }
    async create(dataUser, createCustomerSupportDto) {
        const customerSupport = this.customerSupportRepository.create({
            id_customer: dataUser.id,
            ...createCustomerSupportDto,
        });
        try {
            return await this.customerSupportRepository.save(customerSupport);
        }
        catch (error) {
            throw new common_1.HttpException('Não foi possível criar registro', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    findAll() {
        return this.customerSupportRepository.find();
    }
    async findOne(id) {
        const customerSupport = await this.customerSupportRepository.findOne({
            where: { id: id },
        });
        if (!customerSupport) {
            throw new common_1.NotFoundException(`Customer support ID: ${id} not found`);
        }
        return customerSupport;
    }
    async findAllByUserId(userId) {
        const customerSupport = await this.customerSupportRepository.find({
            where: { id_customer: userId },
        });
        if (!customerSupport.length) {
            throw new common_1.NotFoundException(`No customer support records found for user ID: ${userId}`);
        }
        return customerSupport;
    }
    async update(id, _updateCustomerSupportDto) {
        const customerSupport = await this.customerSupportRepository.preload({
            ..._updateCustomerSupportDto,
            id: id,
        });
        return this.customerSupportRepository.save(customerSupport);
    }
    async remove(id) {
        const customerSupport = await this.customerSupportRepository.findOne({
            where: { id: +id },
        });
        if (!customerSupport) {
            throw new common_1.NotFoundException(`Customer support ID: ${id} not found`);
        }
        return this.customerSupportRepository.remove(customerSupport);
    }
};
exports.CustomerSupportService = CustomerSupportService;
exports.CustomerSupportService = CustomerSupportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_support_entity_1.CustomerSupport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomerSupportService);
//# sourceMappingURL=customer-support.service.js.map