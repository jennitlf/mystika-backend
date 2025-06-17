import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConsultantSupportService } from './cosultant-support.service';
import { ConsultantSupportController } from './cosultant-support.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultantSupport } from 'src/shared/entities/consultant_support.entity';
import { DecodeTokenMiddleware } from 'src/middlewares/decode-token.moddleware';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultantSupport])],
  controllers: [ConsultantSupportController],
  providers: [ConsultantSupportService],
  exports: [ConsultantSupportService],
})
export class ConsultantSupportModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodeTokenMiddleware)
      .forRoutes({ path: 'consultant-support*', method: RequestMethod.ALL });
  }
}
