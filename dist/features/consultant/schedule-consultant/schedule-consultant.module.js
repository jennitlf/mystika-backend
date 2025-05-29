"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleConsultantModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_consultant_service_1 = require("./schedule-consultant.service");
const schedule_consultant_controller_1 = require("./schedule-consultant.controller");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_consultant_entity_1 = require("../../../shared/entities/schedule_consultant.entity");
const schedule_exception_entity_1 = require("../../../shared/entities/schedule_exception.entity");
const date_utils_1 = require("../../../shared/utils/date.utils");
const consultation_entity_1 = require("../../../shared/entities/consultation.entity");
let ScheduleConsultantModule = class ScheduleConsultantModule {
};
exports.ScheduleConsultantModule = ScheduleConsultantModule;
exports.ScheduleConsultantModule = ScheduleConsultantModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                schedule_consultant_entity_1.ScheduleConsultant,
                schedule_exception_entity_1.ScheduleException,
                consultation_entity_1.Consultation,
            ]),
        ],
        controllers: [schedule_consultant_controller_1.ScheduleConsultantController],
        providers: [schedule_consultant_service_1.ScheduleConsultantService, date_utils_1.DateUtilsService],
    })
], ScheduleConsultantModule);
//# sourceMappingURL=schedule-consultant.module.js.map