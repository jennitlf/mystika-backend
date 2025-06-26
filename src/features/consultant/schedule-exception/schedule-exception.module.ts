import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ScheduleExceptionService } from './schedule-exception.service';
import { ScheduleExceptionController } from './schedule-exception.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';
import { ScheduleConsultant } from 'src/shared/entities/schedule_consultant.entity';
import { DecodeTokenMiddleware } from 'src/middlewares/decode-token.moddleware';
import { ScheduleConsultantModule } from '../schedule-consultant/schedule-consultant.module';
import { DateUtilsService } from 'src/shared/utils/date.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleException, ScheduleConsultant]),
  ScheduleConsultantModule
  ],
  controllers: [ScheduleExceptionController],
  providers: [ScheduleExceptionService, ScheduleConsultant, DateUtilsService],
})
export class ScheduleExceptionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodeTokenMiddleware)
      .forRoutes(
        { path: 'schedule-consultant*', method: RequestMethod.POST },
        { path: 'schedule-consultant*', method: RequestMethod.PATCH },
        { path: 'schedule-consultant*', method: RequestMethod.DELETE },
      );
  }
}
