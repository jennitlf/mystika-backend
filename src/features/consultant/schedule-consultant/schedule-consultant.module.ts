import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ScheduleConsultantService } from './schedule-consultant.service';
import { ScheduleConsultantController } from './schedule-consultant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleConsultant } from 'src/shared/entities/schedule_consultant.entity';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';
import { DateUtilsService } from 'src/shared/utils/date.utils';
import { Consultation } from 'src/shared/entities/consultation.entity';
import { DecodeTokenMiddleware } from 'src/middlewares/decode-token.moddleware';
import { ConsultantSpecialtyModule } from '../consultant-specialty/consultant-specialty.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduleConsultant,
      ScheduleException,
      Consultation,
    ]),
    ConsultantSpecialtyModule,
  ],
  controllers: [ScheduleConsultantController],
  providers: [ScheduleConsultantService, DateUtilsService],
  exports: [ScheduleConsultantService],
})
export class ScheduleConsultantModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodeTokenMiddleware)
      .forRoutes(
        { path: 'schedule-consultant*', method: RequestMethod.POST },
        { path: 'schedule-consultant*', method: RequestMethod.DELETE },
      );
  }
}
