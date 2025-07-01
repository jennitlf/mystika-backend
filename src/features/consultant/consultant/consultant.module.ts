import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConsultantService } from './consultant.service';
import { ConsultantController } from './consultant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultant } from 'src/shared/entities/consultant.entity';
import { Specialty } from 'src/shared/entities/specialty.entity';
import { ConsultantSpecialty } from 'src/shared/entities/consultant_specialty.entity';
import { DecodeTokenMiddleware } from 'src/middlewares/decode-token.moddleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultant, Specialty, ConsultantSpecialty]),
  ],
  controllers: [ConsultantController],
  providers: [ConsultantService],
  exports: [ConsultantService],
})
export class ConsultantModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodeTokenMiddleware)
      .forRoutes({ path: 'consultant*', method: RequestMethod.PATCH });
  }
}
