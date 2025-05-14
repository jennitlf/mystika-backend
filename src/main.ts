import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
  });

  const config = new DocumentBuilder()
    .setTitle('Mystika')
    .setDescription(
      'Esta documentação visa esclarecer as funcionalidades do site Mystika',
    )
    .setVersion('1.0')
    .addBearerAuth()
    // .addTag('APIs')
    .build();

  app.useGlobalPipes(new ValidationPipe());
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3001);
}
bootstrap();
