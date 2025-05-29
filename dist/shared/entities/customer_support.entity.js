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
exports.CustomerSupport = void 0;
const typeorm_1 = require("typeorm");
const adm_entity_1 = require("./adm.entity");
const customer_entity_1 = require("./customer.entity");
let CustomerSupport = class CustomerSupport {
};
exports.CustomerSupport = CustomerSupport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CustomerSupport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'id_customer',
        type: 'int',
        nullable: false,
    }),
    __metadata("design:type", Number)
], CustomerSupport.prototype, "id_customer", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'email',
        type: 'varchar',
        nullable: false,
        length: 60,
    }),
    __metadata("design:type", String)
], CustomerSupport.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'phone',
        nullable: false,
        type: 'varchar',
        length: 15,
    }),
    __metadata("design:type", String)
], CustomerSupport.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'title',
        type: 'varchar',
        nullable: false,
        length: 100,
    }),
    __metadata("design:type", String)
], CustomerSupport.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'content',
        type: 'varchar',
        nullable: false,
        length: 300,
    }),
    __metadata("design:type", String)
], CustomerSupport.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'varchar',
        length: 30,
        default: 'pendente',
    }),
    __metadata("design:type", String)
], CustomerSupport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'admResponsible',
        type: 'int',
        default: 1,
    }),
    __metadata("design:type", adm_entity_1.Adm)
], CustomerSupport.prototype, "admResponsible", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CustomerSupport.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CustomerSupport.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.customerSupport),
    (0, typeorm_1.JoinColumn)({ name: 'id_customer' }),
    __metadata("design:type", customer_entity_1.Customer)
], CustomerSupport.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adm_entity_1.Adm, (adm) => adm.customerSupport),
    (0, typeorm_1.JoinColumn)({ name: 'admResponsible' }),
    __metadata("design:type", Array)
], CustomerSupport.prototype, "adm", void 0);
exports.CustomerSupport = CustomerSupport = __decorate([
    (0, typeorm_1.Entity)('customer_support')
], CustomerSupport);
//# sourceMappingURL=customer_support.entity.js.map