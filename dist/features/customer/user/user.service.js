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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../../../shared/entities/customer.entity");
let UserService = class UserService {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async create(createUserDto) {
        const { email } = createUserDto;
        const verifiedUser = await this.customerRepository.findOne({
            where: { email: email },
        });
        if (verifiedUser) {
            throw new common_1.HttpException(`email already registered: ${email}`, common_1.HttpStatus.CONFLICT);
        }
        const costumer = this.customerRepository.create(createUserDto);
        return this.customerRepository.save(costumer);
    }
    async findAll() {
        return this.customerRepository.find();
    }
    async findByEmail(email) {
        const customer = await this.customerRepository.findOne({
            where: { email: email },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Costumer not found`);
        }
        return customer;
    }
    async findByEmailforRegister(email) {
        const customer = await this.customerRepository.findOne({
            where: { email: email },
        });
        if (!customer) {
            return null;
        }
        return customer;
    }
    async findOne(id) {
        const customer = await this.customerRepository.findOne({
            where: { id: +id },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer not found`);
        }
        return customer;
    }
    async update(id, updateUserDto) {
        const customer = await this.customerRepository.preload({
            ...updateUserDto,
            id: +id,
        });
        return this.customerRepository.save(customer);
    }
    async remove(id) {
        const customer = await this.customerRepository.findOne({
            where: { id: +id },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer ID: ${id} not found`);
        }
        return this.customerRepository.remove(customer);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map