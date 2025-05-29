"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultantSupportModule = void 0;
const common_1 = require("@nestjs/common");
const cosultant_support_service_1 = require("./cosultant-support.service");
const cosultant_support_controller_1 = require("./cosultant-support.controller");
const typeorm_1 = require("@nestjs/typeorm");
const consultant_support_entity_1 = require("../../../shared/entities/consultant_support.entity");
const decode_token_moddleware_1 = require("../../../middlewares/decode-token.moddleware");
let ConsultantSupportModule = class ConsultantSupportModule {
    configure(consumer) {
        consumer
            .apply(decode_token_moddleware_1.DecodeTokenMiddleware)
            .forRoutes({ path: 'consultant-support*', method: common_1.RequestMethod.ALL });
    }
};
exports.ConsultantSupportModule = ConsultantSupportModule;
exports.ConsultantSupportModule = ConsultantSupportModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([consultant_support_entity_1.ConsultantSupport])],
        controllers: [cosultant_support_controller_1.ConsultantSupportController],
        providers: [cosultant_support_service_1.ConsultantSupportService],
        exports: [cosultant_support_service_1.ConsultantSupportService],
    })
], ConsultantSupportModule);
//# sourceMappingURL=cosultant-support.module.js.map