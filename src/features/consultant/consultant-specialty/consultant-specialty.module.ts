import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConsultantSpecialtyService } from './consultant-specialty.service';
import { ConsultantSpecialtyController } from './consultant-specialty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultantSpecialty } from 'src/shared/entities/consultant_specialty.entity';
import { DecodeTokenMiddleware } from 'src/middlewares/decode-token.moddleware';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultantSpecialty])],
  controllers: [ConsultantSpecialtyController],
  providers: [ConsultantSpecialtyService],
  exports: [ConsultantSpecialtyService],
})
export class ConsultantSpecialtyModule {
  configure(consumer: MiddlewareConsumer){
    consumer
      .apply(DecodeTokenMiddleware)
      .forRoutes(
        { path: 'consultant-specialty*', method: RequestMethod.POST},
        { path: 'consultant-specialty*', method: RequestMethod.PATCH},
        { path: 'consultant-specialty*', method: RequestMethod.DELETE }
      )
  }
}
