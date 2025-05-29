"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationModule = void 0;
const common_1 = require("@nestjs/common");
const consultation_service_1 = require("./consultation.service");
const consultation_controller_1 = require("./consultation.controller");
const typeorm_1 = require("@nestjs/typeorm");
const consultation_entity_1 = require("../../../shared/entities/consultation.entity");
const consultant_specialty_entity_1 = require("../../../shared/entities/consultant_specialty.entity");
const customer_entity_1 = require("../../../shared/entities/customer.entity");
const decode_token_moddleware_1 = require("../../../middlewares/decode-token.moddleware");
const customer_support_module_1 = require("../customer-support/customer-support.module");
let ConsultationModule = class ConsultationModule {
    configure(consumer) {
        consumer
            .apply(decode_token_moddleware_1.DecodeTokenMiddleware)
            .forRoutes({ path: 'consultation**', method: common_1.RequestMethod.ALL });
    }
};
exports.ConsultationModule = ConsultationModule;
exports.ConsultationModule = ConsultationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            customer_support_module_1.CustomerSupportModule,
            typeorm_1.TypeOrmModule.forFeature([consultation_entity_1.Consultation, consultant_specialty_entity_1.ConsultantSpecialty, customer_entity_1.Customer]),
        ],
        controllers: [consultation_controller_1.ConsultationController],
        providers: [consultation_service_1.ConsultationService],
    })
], ConsultationModule);
//# sourceMappingURL=consultation.module.js.map