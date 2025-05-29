"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultantSpecialtyModule = void 0;
const common_1 = require("@nestjs/common");
const consultant_specialty_service_1 = require("./consultant-specialty.service");
const consultant_specialty_controller_1 = require("./consultant-specialty.controller");
const typeorm_1 = require("@nestjs/typeorm");
const consultant_specialty_entity_1 = require("../../../shared/entities/consultant_specialty.entity");
let ConsultantSpecialtyModule = class ConsultantSpecialtyModule {
};
exports.ConsultantSpecialtyModule = ConsultantSpecialtyModule;
exports.ConsultantSpecialtyModule = ConsultantSpecialtyModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([consultant_specialty_entity_1.ConsultantSpecialty])],
        controllers: [consultant_specialty_controller_1.ConsultantSpecialtyController],
        providers: [consultant_specialty_service_1.ConsultantSpecialtyService],
    })
], ConsultantSpecialtyModule);
//# sourceMappingURL=consultant-specialty.module.js.map