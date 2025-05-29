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
exports.ScheduleAvailabilityDto = exports.ScheduleConsultant = void 0;
const typeorm_1 = require("typeorm");
const consultant_specialty_entity_1 = require("./consultant_specialty.entity");
const schedule_exception_entity_1 = require("./schedule_exception.entity");
const consultation_entity_1 = require("./consultation.entity");
let ScheduleConsultant = class ScheduleConsultant {
};
exports.ScheduleConsultant = ScheduleConsultant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ScheduleConsultant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_consultant_specialty', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], ScheduleConsultant.prototype, "id_consultant_specialty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: 'date', nullable: false }),
    __metadata("design:type", Date)
], ScheduleConsultant.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'day_week', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], ScheduleConsultant.prototype, "day_week", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hour_initial', type: 'time', nullable: false }),
    __metadata("design:type", String)
], ScheduleConsultant.prototype, "hour_initial", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hour_end', type: 'time', nullable: false }),
    __metadata("design:type", String)
], ScheduleConsultant.prototype, "hour_end", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'varchar',
        nullable: false,
        default: 'disponível',
    }),
    __metadata("design:type", String)
], ScheduleConsultant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => consultant_specialty_entity_1.ConsultantSpecialty, (consultantSpecialty) => consultantSpecialty.scheduleConsultant),
    (0, typeorm_1.JoinColumn)({ name: 'id_consultant_specialty' }),
    __metadata("design:type", consultant_specialty_entity_1.ConsultantSpecialty)
], ScheduleConsultant.prototype, "consultantSpecialty", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => schedule_exception_entity_1.ScheduleException, (scheduleException) => scheduleException.scheduleConsultant),
    __metadata("design:type", Array)
], ScheduleConsultant.prototype, "scheduleException", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => consultation_entity_1.Consultation, (consultation) => consultation.scheduleConsultant),
    __metadata("design:type", Array)
], ScheduleConsultant.prototype, "consultation", void 0);
exports.ScheduleConsultant = ScheduleConsultant = __decorate([
    (0, typeorm_1.Entity)('schedule_consultant')
], ScheduleConsultant);
class ScheduleAvailabilityDto {
}
exports.ScheduleAvailabilityDto = ScheduleAvailabilityDto;
//# sourceMappingURL=schedule_consultant.entity.js.map