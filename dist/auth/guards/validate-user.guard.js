"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateUserGuard = void 0;
const common_1 = require("@nestjs/common");
let ValidateUserGuard = class ValidateUserGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Usuário não autenticado.');
        }
        if (user.role !== 'user') {
            throw new common_1.ForbiddenException('Acesso negado: Apenas usuários podem criar suporte.');
        }
        return true;
    }
};
exports.ValidateUserGuard = ValidateUserGuard;
exports.ValidateUserGuard = ValidateUserGuard = __decorate([
    (0, common_1.Injectable)()
], ValidateUserGuard);
//# sourceMappingURL=validate-user.guard.js.map