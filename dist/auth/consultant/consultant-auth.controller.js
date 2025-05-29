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
exports.ConsultantAuthController = void 0;
const common_1 = require("@nestjs/common");
const consultant_auth_service_1 = require("./consultant-auth.service");
const create_consultant_dto_1 = require("../../shared/dtos/create-consultant.dto");
let ConsultantAuthController = class ConsultantAuthController {
    constructor(ConsultantAuthService) {
        this.ConsultantAuthService = ConsultantAuthService;
    }
    async register(req, body) {
        const role = req.url.includes('consultant')
            ? 'consultant'
            : req.url.includes('user')
                ? 'user'
                : 'adm';
        const userDto = { ...body, role };
        return this.ConsultantAuthService.register(userDto);
    }
    async login(body) {
        const user = await this.ConsultantAuthService.validateUser(body.email, body.password);
        if (!user) {
            throw new Error('Usuário ou senha incorreta');
        }
        return this.ConsultantAuthService.login(user);
    }
};
exports.ConsultantAuthController = ConsultantAuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, create_consultant_dto_1.CreateConsultantDto]),
    __metadata("design:returntype", Promise)
], ConsultantAuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsultantAuthController.prototype, "login", null);
exports.ConsultantAuthController = ConsultantAuthController = __decorate([
    (0, common_1.Controller)('auth/consultant'),
    __metadata("design:paramtypes", [consultant_auth_service_1.ConsultantAuthService])
], ConsultantAuthController);
//# sourceMappingURL=consultant-auth.controller.js.map