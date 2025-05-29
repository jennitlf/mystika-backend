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
exports.ConsultantSupport = void 0;
const typeorm_1 = require("typeorm");
const consultant_entity_1 = require("./consultant.entity");
const adm_entity_1 = require("./adm.entity");
let ConsultantSupport = class ConsultantSupport {
};
exports.ConsultantSupport = ConsultantSupport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ConsultantSupport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_consultant', nullable: false, type: 'int' }),
    __metadata("design:type", Number)
], ConsultantSupport.prototype, "id_consultant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', nullable: false, type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], ConsultantSupport.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], ConsultantSupport.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title', type: 'varchar', nullable: false, length: 100 }),
    __metadata("design:type", String)
], ConsultantSupport.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content', type: 'varchar', nullable: false, length: 300 }),
    __metadata("design:type", String)
], ConsultantSupport.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'varchar',
        nullable: false,
        length: 50,
        default: 'pendente',
    }),
    __metadata("design:type", String)
], ConsultantSupport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'admResponsible',
        type: 'int',
        nullable: false,
        default: 1,
    }),
    __metadata("design:type", adm_entity_1.Adm)
], ConsultantSupport.prototype, "admResponsible", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ConsultantSupport.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ConsultantSupport.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => consultant_entity_1.Consultant, (consultant) => consultant.consultantSupport),
    (0, typeorm_1.JoinColumn)({ name: 'id_consultant' }),
    __metadata("design:type", consultant_entity_1.Consultant)
], ConsultantSupport.prototype, "consultant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adm_entity_1.Adm, (adm) => adm.consultantSupport),
    (0, typeorm_1.JoinColumn)({ name: 'admResponsible' }),
    __metadata("design:type", Array)
], ConsultantSupport.prototype, "adm", void 0);
exports.ConsultantSupport = ConsultantSupport = __decorate([
    (0, typeorm_1.Entity)('consultant_support')
], ConsultantSupport);
//# sourceMappingURL=consultant_support.entity.js.map