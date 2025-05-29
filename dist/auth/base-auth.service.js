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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
let BaseAuthService = class BaseAuthService {
    constructor(jwtService, service) {
        this.jwtService = jwtService;
        this.service = service;
    }
    async register(createDto) {
        const { password, role, email, cpf, ...rest } = createDto;
        if (!password || !role || !email) {
            throw new common_1.BadRequestException('Campos obrigatórios ausentes');
        }
        try {
            if (role === 'consultant') {
                await this.validateCpf(cpf);
                await this.validateEmail(email);
            }
            else if (role === 'user' || role === 'adm') {
                await this.validateEmail(email);
            }
            else {
                throw new common_1.BadRequestException('Role inválido');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const userDto = { ...rest, password: hashedPassword, email, role };
            return this.service.create(userDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Erro ao registrar usuário', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new common_1.BadRequestException('E-mail inválido');
        }
        const emailExists = await this.service.findByEmailforRegister(email);
        if (emailExists) {
            throw new common_1.HttpException('E-mail já cadastrado', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validateCpf(cpf) {
        if (!cpf || cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
            throw new common_1.BadRequestException('CPF inválido');
        }
        if (/^(\d)\1+$/.test(cpf)) {
            throw new common_1.BadRequestException('CPF inválido');
        }
        const calculateCheckDigit = (cpf, factor) => {
            let total = 0;
            for (let i = 0; i < factor - 1; i++) {
                total += parseInt(cpf[i]) * (factor - i);
            }
            const remainder = (total * 10) % 11;
            return remainder === 10 ? 0 : remainder;
        };
        const firstCheckDigit = calculateCheckDigit(cpf, 10);
        const secondCheckDigit = calculateCheckDigit(cpf, 11);
        if (firstCheckDigit !== parseInt(cpf[9]) ||
            secondCheckDigit !== parseInt(cpf[10])) {
            throw new common_1.BadRequestException('CPF inválido');
        }
        const cpfExists = await this.service.findByCpf(cpf);
        if (cpfExists) {
            throw new common_1.HttpException('CPF já cadastrado', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validateUser(email, password) {
        const user = await this.service.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            id: user.id,
            name: user.name,
            role: user.role,
        };
        return { access_token: this.jwtService.sign(payload) };
    }
};
exports.BaseAuthService = BaseAuthService;
exports.BaseAuthService = BaseAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object])
], BaseAuthService);
//# sourceMappingURL=base-auth.service.js.map