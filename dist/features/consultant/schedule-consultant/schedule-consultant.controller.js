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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleConsultantController = void 0;
const common_1 = require("@nestjs/common");
const schedule_consultant_service_1 = require("./schedule-consultant.service");
const create_schedule_consultant_dto_1 = require("../../../shared/dtos/create-schedule-consultant.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const create_schedule_recurring_dto_1 = require("../../../shared/dtos/create-schedule-recurring.dto");
let ScheduleConsultantController = class ScheduleConsultantController {
    constructor(scheduleConsultantService) {
        this.scheduleConsultantService = scheduleConsultantService;
    }
    async getTimeslots(idConsultantSpecialty, date) {
        return await this.scheduleConsultantService.getTimeslots(idConsultantSpecialty, date);
    }
    create(createScheduleConsultantDto) {
        return this.scheduleConsultantService.create(createScheduleConsultantDto);
    }
    async createRecurring(createRecurringScheduleDto) {
        return this.scheduleConsultantService.createRecurring(createRecurringScheduleDto);
    }
    remove(id) {
        return this.scheduleConsultantService.remove(id);
    }
};
exports.ScheduleConsultantController = ScheduleConsultantController;
__decorate([
    (0, common_1.Get)(':idConsultantSpecialty/timeslots'),
    (0, swagger_1.ApiQuery)({
        name: 'date',
        required: false,
        type: String,
        example: '2025-01-01',
    }),
    __param(0, (0, common_1.Param)('idConsultantSpecialty')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ScheduleConsultantController.prototype, "getTimeslots", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_consultant_dto_1.CreateScheduleConsultantDto]),
    __metadata("design:returntype", void 0)
], ScheduleConsultantController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('recurring'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_recurring_dto_1.CreateScheduleRecurringDto]),
    __metadata("design:returntype", Promise)
], ScheduleConsultantController.prototype, "createRecurring", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleConsultantController.prototype, "remove", null);
exports.ScheduleConsultantController = ScheduleConsultantController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('schedule-consultant'),
    __metadata("design:paramtypes", [schedule_consultant_service_1.ScheduleConsultantService])
], ScheduleConsultantController);
//# sourceMappingURL=schedule-consultant.controller.js.map