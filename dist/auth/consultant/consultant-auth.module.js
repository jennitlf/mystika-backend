"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultantAuthModule = void 0;
const common_1 = require("@nestjs/common");
const consultant_auth_service_1 = require("./consultant-auth.service");
const consultant_auth_controller_1 = require("./consultant-auth.controller");
const typeorm_1 = require("@nestjs/typeorm");
const consultant_module_1 = require("../../features/consultant/consultant/consultant.module");
const consultant_entity_1 = require("../../shared/entities/consultant.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let ConsultantAuthModule = class ConsultantAuthModule {
};
exports.ConsultantAuthModule = ConsultantAuthModule;
exports.ConsultantAuthModule = ConsultantAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([consultant_entity_1.Consultant]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1h' },
                }),
            }),
            consultant_module_1.ConsultantModule,],
        controllers: [consultant_auth_controller_1.ConsultantAuthController],
        providers: [consultant_auth_service_1.ConsultantAuthService],
    })
], ConsultantAuthModule);
//# sourceMappingURL=consultant-auth.module.js.map