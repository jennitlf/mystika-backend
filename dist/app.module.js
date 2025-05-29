"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const consultant_module_1 = require("./features/consultant/consultant/consultant.module");
const database_module_1 = require("./database/database.module");
const config_1 = require("@nestjs/config");
const specialty_module_1 = require("./features/consultant/specialty/specialty.module");
const consultant_specialty_module_1 = require("./features/consultant/consultant-specialty/consultant-specialty.module");
const app_controller_1 = require("./app.controller");
const general_find_module_1 = require("./features/customer/general-find/general-find.module");
const user_module_1 = require("./features/customer/user/user.module");
const base_auth_module_1 = require("./auth/base-auth.module");
const schedule_consultant_module_1 = require("./features/consultant/schedule-consultant/schedule-consultant.module");
const schedule_exception_module_1 = require("./features/consultant/schedule-exception/schedule-exception.module");
const consultation_module_1 = require("./features/customer/consultation/consultation.module");
const cosultant_support_module_1 = require("./features/consultant/consultant-support/cosultant-support.module");
const customer_support_module_1 = require("./features/customer/customer-support/customer-support.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply((req, res, next) => {
            if (req.url === '/favicon.ico') {
                res.status(204).end();
            }
            else {
                next();
            }
        }).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            database_module_1.DatabaseModule,
            consultant_module_1.ConsultantModule,
            specialty_module_1.SpecialtyModule,
            consultant_specialty_module_1.ConsultantSpecialtyModule,
            general_find_module_1.GeneralFindModule,
            user_module_1.UserModule,
            base_auth_module_1.BaseAuthModule,
            schedule_consultant_module_1.ScheduleConsultantModule,
            schedule_exception_module_1.ScheduleExceptionModule,
            consultation_module_1.ConsultationModule,
            customer_support_module_1.CustomerSupportModule,
            cosultant_support_module_1.ConsultantSupportModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map