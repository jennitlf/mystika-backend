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
exports.ConsultantSpecialty = void 0;
const typeorm_1 = require("typeorm");
const consultant_entity_1 = require("./consultant.entity");
const specialty_entity_1 = require("./specialty.entity");
const schedule_consultant_entity_1 = require("./schedule_consultant.entity");
let ConsultantSpecialty = class ConsultantSpecialty {
};
exports.ConsultantSpecialty = ConsultantSpecialty;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ConsultantSpecialty.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_consultant', nullable: false, type: 'int' }),
    __metadata("design:type", Number)
], ConsultantSpecialty.prototype, "id_consultant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_specialty', nullable: false, type: 'int' }),
    __metadata("design:type", Number)
], ConsultantSpecialty.prototype, "id_specialty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration', nullable: false, type: 'int' }),
    __metadata("design:type", Number)
], ConsultantSpecialty.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value_per_duration', nullable: false, type: 'int' }),
    __metadata("design:type", Number)
], ConsultantSpecialty.prototype, "value_per_duration", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ConsultantSpecialty.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], ConsultantSpecialty.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => consultant_entity_1.Consultant, (consultant) => consultant.consultantSpecialties),
    (0, typeorm_1.JoinColumn)({ name: 'id_consultant' }),
    __metadata("design:type", consultant_entity_1.Consultant)
], ConsultantSpecialty.prototype, "consultant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => specialty_entity_1.Specialty, (specialty) => specialty.consultantSpecialties),
    (0, typeorm_1.JoinColumn)({ name: 'id_specialty' }),
    __metadata("design:type", specialty_entity_1.Specialty)
], ConsultantSpecialty.prototype, "specialty", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => schedule_consultant_entity_1.ScheduleConsultant, (scheduleConsultant) => scheduleConsultant.consultantSpecialty),
    __metadata("design:type", Array)
], ConsultantSpecialty.prototype, "scheduleConsultant", void 0);
exports.ConsultantSpecialty = ConsultantSpecialty = __decorate([
    (0, typeorm_1.Entity)('consultant_specialty'),
    (0, typeorm_1.Unique)(['id_consultant', 'id_specialty'])
], ConsultantSpecialty);
//# sourceMappingURL=consultant_specialty.entity.js.map