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
exports.ScheduleException = void 0;
const typeorm_1 = require("typeorm");
const schedule_consultant_entity_1 = require("./schedule_consultant.entity");
let ScheduleException = class ScheduleException {
};
exports.ScheduleException = ScheduleException;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ScheduleException.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'id_schedule_consultant',
        nullable: false,
        type: 'int',
    }),
    __metadata("design:type", Number)
], ScheduleException.prototype, "id_schedule_consultant", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'date_exception',
        type: 'date',
        nullable: false,
    }),
    __metadata("design:type", Date)
], ScheduleException.prototype, "date_exception", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'day_week',
        type: 'int',
        nullable: false,
    }),
    __metadata("design:type", Number)
], ScheduleException.prototype, "day_week", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unavailable_time',
        type: 'time',
        nullable: false,
    }),
    __metadata("design:type", String)
], ScheduleException.prototype, "unavailable_time", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'reason',
        type: 'varchar',
        length: 45,
    }),
    __metadata("design:type", String)
], ScheduleException.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => schedule_consultant_entity_1.ScheduleConsultant, (scheduleConsultant) => scheduleConsultant.scheduleException),
    (0, typeorm_1.JoinColumn)({ name: 'id_schedule_consultant' }),
    __metadata("design:type", schedule_consultant_entity_1.ScheduleConsultant)
], ScheduleException.prototype, "scheduleConsultant", void 0);
exports.ScheduleException = ScheduleException = __decorate([
    (0, typeorm_1.Entity)('schedule_exception')
], ScheduleException);
//# sourceMappingURL=schedule_exception.entity.js.map