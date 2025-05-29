"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const interceptor_errors_1 = require("./middlewares/interceptor-errors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,POST,PUT,DELETE',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Mystika')
        .setDescription('Esta documentação visa esclarecer as funcionalidades do site Mystika')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalFilters(new interceptor_errors_1.GlobalExceptionFilter());
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map