"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleExceptionModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_exception_service_1 = require("./schedule-exception.service");
const schedule_exception_controller_1 = require("./schedule-exception.controller");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_exception_entity_1 = require("../../../shared/entities/schedule_exception.entity");
const schedule_consultant_entity_1 = require("../../../shared/entities/schedule_consultant.entity");
let ScheduleExceptionModule = class ScheduleExceptionModule {
};
exports.ScheduleExceptionModule = ScheduleExceptionModule;
exports.ScheduleExceptionModule = ScheduleExceptionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([schedule_exception_entity_1.ScheduleException, schedule_consultant_entity_1.ScheduleConsultant])],
        controllers: [schedule_exception_controller_1.ScheduleExceptionController],
        providers: [schedule_exception_service_1.ScheduleExceptionService],
    })
], ScheduleExceptionModule);
//# sourceMappingURL=schedule-exception.module.js.map