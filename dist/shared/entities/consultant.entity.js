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
exports.Consultant = void 0;
const typeorm_1 = require("typeorm");
const consultant_specialty_entity_1 = require("./consultant_specialty.entity");
const consultant_support_entity_1 = require("./consultant_support.entity");
let Consultant = class Consultant {
};
exports.Consultant = Consultant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Consultant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'name',
        nullable: false,
        type: 'varchar',
        length: 60,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Consultant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cpf',
        nullable: false,
        type: 'varchar',
        length: 11,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Consultant.prototype, "cpf", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'phone',
        nullable: false,
        type: 'varchar',
        length: 15,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Consultant.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'email',
        unique: true,
        nullable: false,
        type: 'varchar',
        length: 60,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Consultant.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'password',
        nullable: false,
        type: 'varchar',
        length: 300,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Consultant.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'profile_data',
        nullable: false,
        type: 'varchar',
        length: 800,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Consultant.prototype, "profile_data", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'image_consultant',
        nullable: false,
        type: 'varchar',
        length: 300,
        default: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
    }),
    __metadata("design:type", String)
], Consultant.prototype, "image_consultant", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        nullable: false,
        default: 'inativo',
        type: 'varchar',
        length: 15,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_plan',
        nullable: false,
        default: 'mensal',
        type: 'varchar',
        length: 25,
    }),
    __metadata("design:type", String)
], Consultant.prototype, "payment_plan", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'appellant',
        nullable: false,
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Consultant.prototype, "appellant", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'about_specialties',
        nullable: false,
        type: 'varchar',
        length: 700,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Consultant.prototype, "about_specialties", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'consultants_story',
        nullable: false,
        type: 'varchar',
        length: 700,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Consultant.prototype, "consultants_story", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'consultations_carried_out',
        nullable: true,
        default: 100,
        type: 'int',
    }),
    __metadata("design:type", Number)
], Consultant.prototype, "consultations_carried_out", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'role',
        type: 'varchar',
        length: 10,
        default: 'consultant',
    }),
    __metadata("design:type", String)
], Consultant.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Consultant.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Consultant.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => consultant_specialty_entity_1.ConsultantSpecialty, (consultantSpecialty) => consultantSpecialty.consultant),
    __metadata("design:type", Array)
], Consultant.prototype, "consultantSpecialties", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => consultant_support_entity_1.ConsultantSupport, (consultantSupport) => consultantSupport.consultant),
    __metadata("design:type", Array)
], Consultant.prototype, "consultantSupport", void 0);
exports.Consultant = Consultant = __decorate([
    (0, typeorm_1.Entity)('consultant')
], Consultant);
//# sourceMappingURL=consultant.entity.js.map