"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSupportModule = void 0;
const common_1 = require("@nestjs/common");
const customer_support_service_1 = require("./customer-support.service");
const customer_support_controller_1 = require("./customer-support.controller");
const customer_support_entity_1 = require("../../../shared/entities/customer_support.entity");
const typeorm_1 = require("@nestjs/typeorm");
const decode_token_moddleware_1 = require("../../../middlewares/decode-token.moddleware");
let CustomerSupportModule = class CustomerSupportModule {
    configure(consumer) {
        consumer
            .apply(decode_token_moddleware_1.DecodeTokenMiddleware)
            .forRoutes({ path: 'customer-support*', method: common_1.RequestMethod.ALL });
    }
};
exports.CustomerSupportModule = CustomerSupportModule;
exports.CustomerSupportModule = CustomerSupportModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([customer_support_entity_1.CustomerSupport])],
        controllers: [customer_support_controller_1.CustomerSupportController],
        providers: [customer_support_service_1.CustomerSupportService],
        exports: [customer_support_service_1.CustomerSupportService],
    })
], CustomerSupportModule);
//# sourceMappingURL=customer-support.module.js.map