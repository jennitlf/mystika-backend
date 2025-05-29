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
exports.Consultation = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const schedule_consultant_entity_1 = require("./schedule_consultant.entity");
let Consultation = class Consultation {
};
exports.Consultation = Consultation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Consultation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'id_customer',
        type: 'int',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], Consultation.prototype, "id_customer", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'id_schedule_consultant',
        type: 'int',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], Consultation.prototype, "id_schedule_consultant", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'appoinment_date',
        type: 'date',
        nullable: false,
        default: () => `'2025-01-01'`,
    }),
    __metadata("design:type", Date)
], Consultation.prototype, "appoinment_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'appoinment_time',
        type: 'time',
        nullable: false,
        default: () => `'12:00:00'`,
    }),
    __metadata("design:type", String)
], Consultation.prototype, "appoinment_time", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'varchar',
        nullable: true,
        length: '15',
        default: 'pending',
    }),
    __metadata("design:type", String)
], Consultation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'attended',
        type: 'varchar',
        nullable: true,
        default: 'pending',
        length: 7,
    }),
    __metadata("design:type", String)
], Consultation.prototype, "attended", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Consultation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Consultation.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.consultation),
    (0, typeorm_1.JoinColumn)({ name: 'id_customer' }),
    __metadata("design:type", customer_entity_1.Customer)
], Consultation.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => schedule_consultant_entity_1.ScheduleConsultant, (scheduleConsultant) => scheduleConsultant.consultation),
    (0, typeorm_1.JoinColumn)({ name: 'id_schedule_consultant' }),
    __metadata("design:type", schedule_consultant_entity_1.ScheduleConsultant)
], Consultation.prototype, "scheduleConsultant", void 0);
exports.Consultation = Consultation = __decorate([
    (0, typeorm_1.Entity)('consultation')
], Consultation);
//# sourceMappingURL=consultation.entity.js.map