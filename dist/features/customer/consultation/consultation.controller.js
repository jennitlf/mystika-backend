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
exports.ConsultationController = void 0;
const common_1 = require("@nestjs/common");
const consultation_service_1 = require("./consultation.service");
const create_consultation_dto_1 = require("../../../shared/dtos/create-consultation.dto");
const update_consultation_dto_1 = require("../../../shared/dtos/update-consultation.dto");
const swagger_1 = require("@nestjs/swagger");
const role_guard_factory_1 = require("../../../auth/factories/role-guard.factory");
const ownership_or_admin_guard_1 = require("../../../auth/guards/ownership-or-admin.guard");
let ConsultationController = class ConsultationController {
    constructor(consultationService) {
        this.consultationService = consultationService;
    }
    create(req, createConsultationDto) {
        const dataUser = req.user.id;
        return this.consultationService.create(dataUser, createConsultationDto);
    }
    findAll(idCustomer, idConsultantSpecialty, appoinmentDate, appoinmentTime, page = 1, limit = 10) {
        return this.consultationService.findAll({ idCustomer, idConsultantSpecialty, appoinmentDate, appoinmentTime }, page, limit);
    }
    async findOne(req) {
        const dataUser = req.user.id;
        const result = await this.consultationService.findOne(dataUser);
        return result;
    }
    update(req, updateConsultationDto) {
        const dataUser = req.user.id;
        return this.consultationService.update(dataUser, updateConsultationDto);
    }
    remove(req) {
        const dataUser = req.user.id;
        return this.consultationService.remove(dataUser);
    }
};
exports.ConsultationController = ConsultationController;
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['user'])),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_consultation_dto_1.CreateConsultationDto]),
    __metadata("design:returntype", void 0)
], ConsultationController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm'])),
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'idCustomer', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({
        name: 'idConsultantSpecialty',
        required: false,
        type: Number,
        example: 10,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'appoinmentDate',
        required: false,
        type: String,
        example: 'AAAA-MM-DD',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'appoinmentTime',
        required: false,
        type: String,
        example: '00:00:00',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Query)('idCustomer')),
    __param(1, (0, common_1.Query)('idConsultantSpecialty')),
    __param(2, (0, common_1.Query)('appoinmentDate')),
    __param(3, (0, common_1.Query)('appoinmentTime')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], ConsultationController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm', 'user', 'consultant']), ownership_or_admin_guard_1.OwnershipOrAdminGuard),
    (0, common_1.Get)('byUserId'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm', 'user', 'consultant']), ownership_or_admin_guard_1.OwnershipOrAdminGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_consultation_dto_1.UpdateConsultationDto]),
    __metadata("design:returntype", void 0)
], ConsultationController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm'])),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsultationController.prototype, "remove", null);
exports.ConsultationController = ConsultationController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('consultation'),
    __metadata("design:paramtypes", [consultation_service_1.ConsultationService])
], ConsultationController);
//# sourceMappingURL=consultation.controller.js.map