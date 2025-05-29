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
exports.ConsultantSupportController = void 0;
const common_1 = require("@nestjs/common");
const cosultant_support_service_1 = require("./cosultant-support.service");
const create_consultant_support_dto_1 = require("../../../shared/dtos/create-consultant-support.dto");
const update_consultant_support_dto_1 = require("../../../shared/dtos/update-consultant-support.dto");
const role_guard_factory_1 = require("../../../auth/factories/role-guard.factory");
const ownership_consultant_or_admin_guard_1 = require("../../../auth/guards/ownership-consultant-or-admin.guard");
let ConsultantSupportController = class ConsultantSupportController {
    constructor(consultantSupportService) {
        this.consultantSupportService = consultantSupportService;
    }
    create(req, createConsultantSupportDto) {
        const UserId = req.user.id;
        return this.consultantSupportService.create(UserId, createConsultantSupportDto);
    }
    findAll() {
        return this.consultantSupportService.findAll();
    }
    findAllByUser(req) {
        const userId = req.user.id;
        return this.consultantSupportService.findAllByUserId(userId);
    }
    findOne(id) {
        return this.consultantSupportService.findOne(+id);
    }
    update(id, updateConsultantSupportDto) {
        return this.consultantSupportService.update(+id, updateConsultantSupportDto);
    }
    remove(id) {
        return this.consultantSupportService.remove(+id);
    }
};
exports.ConsultantSupportController = ConsultantSupportController;
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['consultant'])),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_consultant_support_dto_1.CreateConsultantSupportDto]),
    __metadata("design:returntype", void 0)
], ConsultantSupportController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm'])),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConsultantSupportController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['consultant', 'adm'])),
    (0, common_1.Get)('byUser'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsultantSupportController.prototype, "findAllByUser", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm', 'consultant']), ownership_consultant_or_admin_guard_1.OwnershipConsultantOrAdminGuard),
    (0, common_1.Get)('record/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConsultantSupportController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm', 'consultant']), ownership_consultant_or_admin_guard_1.OwnershipConsultantOrAdminGuard),
    (0, common_1.Put)('record/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_consultant_support_dto_1.UpdateConsultantSupportDto]),
    __metadata("design:returntype", void 0)
], ConsultantSupportController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm', 'consultant']), ownership_consultant_or_admin_guard_1.OwnershipConsultantOrAdminGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConsultantSupportController.prototype, "remove", null);
exports.ConsultantSupportController = ConsultantSupportController = __decorate([
    (0, common_1.Controller)('consultant-support'),
    __metadata("design:paramtypes", [cosultant_support_service_1.ConsultantSupportService])
], ConsultantSupportController);
//# sourceMappingURL=cosultant-support.controller.js.map