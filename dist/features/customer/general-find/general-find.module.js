"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralFindModule = void 0;
const common_1 = require("@nestjs/common");
const general_find_service_1 = require("./general-find.service");
const general_find_controller_1 = require("./general-find.controller");
const typeorm_1 = require("@nestjs/typeorm");
const consultant_entity_1 = require("../../../shared/entities/consultant.entity");
const specialty_entity_1 = require("../../../shared/entities/specialty.entity");
const consultant_specialty_entity_1 = require("../../../shared/entities/consultant_specialty.entity");
let GeneralFindModule = class GeneralFindModule {
};
exports.GeneralFindModule = GeneralFindModule;
exports.GeneralFindModule = GeneralFindModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([consultant_entity_1.Consultant, specialty_entity_1.Specialty, consultant_specialty_entity_1.ConsultantSpecialty]),
        ],
        controllers: [general_find_controller_1.GeneralFindController],
        providers: [general_find_service_1.GeneralFindService],
    })
], GeneralFindModule);
//# sourceMappingURL=general-find.module.js.map