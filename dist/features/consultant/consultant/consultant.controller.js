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
exports.ConsultantController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const consultant_service_1 = require("./consultant.service");
const create_consultant_dto_1 = require("../../../shared/dtos/create-consultant.dto");
const update_consultant_dto_1 = require("../../../shared/dtos/update-consultant.dto");
let ConsultantController = class ConsultantController {
    constructor(consultantService) {
        this.consultantService = consultantService;
    }
    create(createConsultantDto) {
        return this.consultantService.create(createConsultantDto);
    }
    findAll(page = 1, limit = 10) {
        return this.consultantService.findAll(page, limit);
    }
    findOne(id) {
        return this.consultantService.findOne(id);
    }
    update(id, updateConsultantDto) {
        return this.consultantService.update(id, updateConsultantDto);
    }
    remove(id) {
        return this.consultantService.remove(id);
    }
};
exports.ConsultantController = ConsultantController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_consultant_dto_1.CreateConsultantDto]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_consultant_dto_1.UpdateConsultantDto]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "update", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "remove", null);
exports.ConsultantController = ConsultantController = __decorate([
    (0, swagger_1.ApiTags)('consultants'),
    (0, common_1.Controller)('consultant'),
    __metadata("design:paramtypes", [consultant_service_1.ConsultantService])
], ConsultantController);
//# sourceMappingURL=consultant.controller.js.map