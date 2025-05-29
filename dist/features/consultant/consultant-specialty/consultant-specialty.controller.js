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
exports.ConsultantSpecialtyController = void 0;
const common_1 = require("@nestjs/common");
const consultant_specialty_service_1 = require("./consultant-specialty.service");
const create_consultant_specialty_dto_1 = require("../../../shared/dtos/create-consultant-specialty.dto");
const update_consultant_specialty_dto_1 = require("../../../shared/dtos/update-consultant-specialty.dto");
const swagger_1 = require("@nestjs/swagger");
let ConsultantSpecialtyController = class ConsultantSpecialtyController {
    constructor(consultantSpecialtyService) {
        this.consultantSpecialtyService = consultantSpecialtyService;
    }
    create(createConsultantSpecialtyDto) {
        return this.consultantSpecialtyService.create(createConsultantSpecialtyDto);
    }
    findAll(consultantName, idConsultant, specialty, minPrice, maxPrice, page = 1, limit = 10) {
        return this.consultantSpecialtyService.findConsultantsByFilters({ consultantName, idConsultant, specialty, minPrice, maxPrice }, page, limit);
    }
    findOne(id) {
        return this.consultantSpecialtyService.findOne(id);
    }
    update(id, updateConsultantSpecialtyDto) {
        return this.consultantSpecialtyService.update(id, updateConsultantSpecialtyDto);
    }
    remove(id) {
        return this.consultantSpecialtyService.remove(id);
    }
};
exports.ConsultantSpecialtyController = ConsultantSpecialtyController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_consultant_specialty_dto_1.CreateConsultantSpecialtyDto]),
    __metadata("design:returntype", void 0)
], ConsultantSpecialtyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({
        name: 'consultantName',
        required: false,
        type: String,
        example: 'John',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'idConsultant',
        required: false,
        type: Number,
        example: '1',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'specialty',
        required: false,
        type: String,
        example: 'Tarot',
    }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, type: Number, example: 50 }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number, example: 200 }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Query)('consultantName')),
    __param(1, (0, common_1.Query)('idConsultant')),
    __param(2, (0, common_1.Query)('specialty')),
    __param(3, (0, common_1.Query)('minPrice')),
    __param(4, (0, common_1.Query)('maxPrice')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ConsultantSpecialtyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConsultantSpecialtyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_consultant_specialty_dto_1.UpdateConsultantSpecialtyDto]),
    __metadata("design:returntype", void 0)
], ConsultantSpecialtyController.prototype, "update", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConsultantSpecialtyController.prototype, "remove", null);
exports.ConsultantSpecialtyController = ConsultantSpecialtyController = __decorate([
    (0, swagger_1.ApiTags)('consultant data in each specialty'),
    (0, common_1.Controller)('consultant-specialty'),
    __metadata("design:paramtypes", [consultant_specialty_service_1.ConsultantSpecialtyService])
], ConsultantSpecialtyController);
//# sourceMappingURL=consultant-specialty.controller.js.map