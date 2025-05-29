"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("../../../shared/entities/customer.entity");
const decode_token_moddleware_1 = require("../../../middlewares/decode-token.moddleware");
let UserModule = class UserModule {
    configure(consumer) {
        consumer
            .apply(decode_token_moddleware_1.DecodeTokenMiddleware)
            .forRoutes({ path: 'user/id/:id', method: common_1.RequestMethod.GET }, { path: 'user', method: common_1.RequestMethod.GET }, { path: 'user/:id', method: common_1.RequestMethod.PUT }, { path: 'user/:id', method: common_1.RequestMethod.DELETE });
    }
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([customer_entity_1.Customer])],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map