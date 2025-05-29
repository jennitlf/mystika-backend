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
exports.OwnershipOrAdminGuard = void 0;
const common_1 = require("@nestjs/common");
const customer_support_service_1 = require("../../features/customer/customer-support/customer-support.service");
let OwnershipOrAdminGuard = class OwnershipOrAdminGuard {
    constructor(customerSupportService) {
        this.customerSupportService = customerSupportService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const id = request.params.id;
        if (user.role === 'adm') {
            return true;
        }
        if (request.originalUrl.includes('/customer-support/record/')) {
            const record = await this.customerSupportService.findOne(id);
            if (!record) {
                throw new common_1.NotFoundException('Registro não encontrado');
            }
            if (record.id_customer !== user.id) {
                throw new common_1.ForbiddenException('Acesso negado: registro não pertence a você.');
            }
        }
        else {
            return true;
        }
        return true;
    }
};
exports.OwnershipOrAdminGuard = OwnershipOrAdminGuard;
exports.OwnershipOrAdminGuard = OwnershipOrAdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_support_service_1.CustomerSupportService])
], OwnershipOrAdminGuard);
//# sourceMappingURL=ownership-or-admin.guard.js.map