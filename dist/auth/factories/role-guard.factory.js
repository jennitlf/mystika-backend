"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleGuard = createRoleGuard;
const role_guard_1 = require("../guards/role.guard");
function createRoleGuard(roles) {
    return new role_guard_1.RoleGuard(roles);
}
//# sourceMappingURL=role-guard.factory.js.map