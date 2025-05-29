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
exports.GeneralFindController = void 0;
const common_1 = require("@nestjs/common");
const general_find_service_1 = require("./general-find.service");
const swagger_1 = require("@nestjs/swagger");
let GeneralFindController = class GeneralFindController {
    constructor(generalFindService) {
        this.generalFindService = generalFindService;
    }
    generalConsultantData(page = 1, limit = 9, name, specialties, minValue, maxValue) {
        return this.generalFindService.generalConsultantData(page, limit, name, specialties, minValue, maxValue);
    }
};
exports.GeneralFindController = GeneralFindController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 9 }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: false, type: String, example: 'John' }),
    (0, swagger_1.ApiQuery)({
        name: 'specialties',
        required: false,
        type: [String],
        example: ['mapa astral', 'tarot das fadas'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'minValue', required: false, type: Number, example: 50 }),
    (0, swagger_1.ApiQuery)({ name: 'maxValue', required: false, type: Number, example: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('name')),
    __param(3, (0, common_1.Query)('specialties')),
    __param(4, (0, common_1.Query)('minValue')),
    __param(5, (0, common_1.Query)('maxValue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Array, Number, Number]),
    __metadata("design:returntype", void 0)
], GeneralFindController.prototype, "generalConsultantData", null);
exports.GeneralFindController = GeneralFindController = __decorate([
    (0, swagger_1.ApiTags)('consult general data from consultants'),
    (0, common_1.Controller)('general-find'),
    __metadata("design:paramtypes", [general_find_service_1.GeneralFindService])
], GeneralFindController);
//# sourceMappingURL=general-find.controller.js.map