import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './middlewares/interceptor-errors';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as bodyParser from 'body-parser';

interface CustomRequest extends express.Request {
  rawBody?: Buffer;
}

async function bootstrap() {
  const expressApp = express();

  expressApp.use((req: CustomRequest, res, next) => {
    if (req.originalUrl.includes('/payments/webhook')) {
      bodyParser.json({
        verify: (req: CustomRequest, res, buf: Buffer) => {
          req.rawBody = buf;
        },
        limit: '10mb',
      })(req, res, next);
    } else {
      bodyParser.json({ limit: '50mb' })(req, res, next);
    }
  });

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    bodyParser: false,
  });
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Mystika')
    .setDescription('Esta documentação visa esclarecer as funcionalidades do site Mystika')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
}

bootstrap();
