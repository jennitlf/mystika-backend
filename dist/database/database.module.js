"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const isProduction = process.env.NODE_ENV === 'production';
                    return {
                        type: 'postgres',
                        url: isProduction ? configService.get('DATABASE_URL') : undefined,
                        host: !isProduction ? configService.get('POSTGRES_HOST') : undefined,
                        port: !isProduction ? parseInt(configService.get('POSTGRES_PORT'), 10) : undefined,
                        username: !isProduction ? configService.get('POSTGRES_USER') : undefined,
                        password: !isProduction ? configService.get('POSTGRES_PASSWORD') : undefined,
                        database: !isProduction ? configService.get('DATABASE_NAME') : undefined,
                        ssl: isProduction ? { rejectUnauthorized: false } : false,
                        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                        synchronize: false,
                    };
                },
            }),
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map