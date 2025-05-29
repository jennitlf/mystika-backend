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
exports.ScheduleExceptionController = void 0;
const common_1 = require("@nestjs/common");
const schedule_exception_service_1 = require("./schedule-exception.service");
const create_schedule_exception_dto_1 = require("../../../shared/dtos/create-schedule-exception.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
let ScheduleExceptionController = class ScheduleExceptionController {
    constructor(scheduleExceptionService) {
        this.scheduleExceptionService = scheduleExceptionService;
    }
    create(createScheduleExceptionDto) {
        return this.scheduleExceptionService.create(createScheduleExceptionDto);
    }
    findAll(idScheduleConsultant) {
        return this.scheduleExceptionService.findAll({ idScheduleConsultant });
    }
    findOne(id) {
        return this.scheduleExceptionService.findOne(+id);
    }
    update(id, updateScheduleExceptionDto) {
        return this.scheduleExceptionService.update(+id, updateScheduleExceptionDto);
    }
    remove(id) {
        return this.scheduleExceptionService.remove(+id);
    }
};
exports.ScheduleExceptionController = ScheduleExceptionController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_exception_dto_1.default]),
    __metadata("design:returntype", void 0)
], ScheduleExceptionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({
        name: 'id schedule consultant',
        required: false,
        type: Number,
        example: '1',
    }),
    __param(0, (0, common_1.Query)('id schedule consultant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ScheduleExceptionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleExceptionController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ScheduleExceptionController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleExceptionController.prototype, "remove", null);
exports.ScheduleExceptionController = ScheduleExceptionController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('schedule-exception'),
    __metadata("design:paramtypes", [schedule_exception_service_1.ScheduleExceptionService])
], ScheduleExceptionController);
//# sourceMappingURL=schedule-exception.controller.js.map