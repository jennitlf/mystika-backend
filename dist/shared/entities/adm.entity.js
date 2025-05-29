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
exports.Adm = void 0;
const typeorm_1 = require("typeorm");
const consultant_support_entity_1 = require("./consultant_support.entity");
const customer_support_entity_1 = require("./customer_support.entity");
let Adm = class Adm {
};
exports.Adm = Adm;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Adm.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', length: 80, nullable: false, type: 'varchar' }),
    __metadata("design:type", String)
], Adm.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'email',
        length: 254,
        unique: true,
        nullable: false,
        type: 'varchar',
    }),
    __metadata("design:type", String)
], Adm.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password', length: 255, type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Adm.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'role',
        length: 3,
        type: 'varchar',
        nullable: false,
        default: 'adm',
    }),
    __metadata("design:type", String)
], Adm.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Adm.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Adm.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => consultant_support_entity_1.ConsultantSupport, (consultantSupport) => consultantSupport.adm),
    __metadata("design:type", Array)
], Adm.prototype, "consultantSupport", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_support_entity_1.CustomerSupport, (customerSupport) => customerSupport.adm),
    __metadata("design:type", Array)
], Adm.prototype, "customerSupport", void 0);
exports.Adm = Adm = __decorate([
    (0, typeorm_1.Entity)('adm')
], Adm);
//# sourceMappingURL=adm.entity.js.map