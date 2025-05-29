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
exports.CustomerSupportController = void 0;
const common_1 = require("@nestjs/common");
const customer_support_service_1 = require("./customer-support.service");
const create_customer_support_dto_1 = require("../../../shared/dtos/create-customer-support.dto");
const update_customer_support_dto_1 = require("../../../shared/dtos/update-customer-support.dto");
const role_guard_factory_1 = require("../../../auth/factories/role-guard.factory");
const validate_user_guard_1 = require("../../../auth/guards/validate-user.guard");
const ownership_or_admin_guard_1 = require("../../../auth/guards/ownership-or-admin.guard");
let CustomerSupportController = class CustomerSupportController {
    constructor(customerSupportService) {
        this.customerSupportService = customerSupportService;
    }
    create(req, createCustomerSupportDto) {
        const dataUser = req.user;
        return this.customerSupportService.create(dataUser, createCustomerSupportDto);
    }
    findAll() {
        return this.customerSupportService.findAll();
    }
    findAllByUser(req) {
        const userId = req.user.id;
        return this.customerSupportService.findAllByUserId(userId);
    }
    findOne(id) {
        return this.customerSupportService.findOne(+id);
    }
    update(id, updateCustomerSupportDto) {
        return this.customerSupportService.update(+id, updateCustomerSupportDto);
    }
    remove(id) {
        return this.customerSupportService.remove(+id);
    }
};
exports.CustomerSupportController = CustomerSupportController;
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['user']), validate_user_guard_1.ValidateUserGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_customer_support_dto_1.CreateCustomerSupportDto]),
    __metadata("design:returntype", void 0)
], CustomerSupportController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm'])),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CustomerSupportController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['user']), validate_user_guard_1.ValidateUserGuard),
    (0, common_1.Get)('byUser'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomerSupportController.prototype, "findAllByUser", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm', 'user']), ownership_or_admin_guard_1.OwnershipOrAdminGuard),
    (0, common_1.Get)('record/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomerSupportController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm', 'user']), ownership_or_admin_guard_1.OwnershipOrAdminGuard),
    (0, common_1.Put)('record/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customer_support_dto_1.UpdateCustomerSupportDto]),
    __metadata("design:returntype", void 0)
], CustomerSupportController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, role_guard_factory_1.createRoleGuard)(['adm', 'user']), ownership_or_admin_guard_1.OwnershipOrAdminGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomerSupportController.prototype, "remove", null);
exports.CustomerSupportController = CustomerSupportController = __decorate([
    (0, common_1.Controller)('customer-support'),
    __metadata("design:paramtypes", [customer_support_service_1.CustomerSupportService])
], CustomerSupportController);
//# sourceMappingURL=customer-support.controller.js.map