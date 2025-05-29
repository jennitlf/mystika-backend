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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const consultation_entity_1 = require("./consultation.entity");
const customer_support_entity_1 = require("./customer_support.entity");
let Customer = class Customer {
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'name',
        nullable: false,
        type: 'varchar',
        length: 60,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'phone',
        nullable: false,
        type: 'varchar',
        length: 15,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'email',
        nullable: false,
        type: 'varchar',
        length: 60,
        unique: true,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'password',
        nullable: false,
        type: 'varchar',
        length: 300,
        default: 'NaN',
    }),
    __metadata("design:type", String)
], Customer.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        nullable: false,
        type: 'varchar',
        length: 15,
        default: 'pending',
    }),
    __metadata("design:type", String)
], Customer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'role',
        nullable: false,
        type: 'varchar',
        length: 4,
        default: 'user',
    }),
    __metadata("design:type", String)
], Customer.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Customer.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Customer.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => consultation_entity_1.Consultation, (consultation) => consultation.customer),
    __metadata("design:type", Array)
], Customer.prototype, "consultation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_support_entity_1.CustomerSupport, (customerSupport) => customerSupport.customer),
    __metadata("design:type", Array)
], Customer.prototype, "customerSupport", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)('customer')
], Customer);
//# sourceMappingURL=customer.entity.js.map