import { Module } from '@nestjs/common';
import { ScheduleConsultantService } from './schedule-consultant.service';
import { ScheduleConsultantController } from './schedule-consultant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleConsultant } from 'src/shared/entities/schedule_consultant.entity';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';
import { DateUtilsService } from 'src/shared/utils/date.utils';
import { Consultation } from 'src/shared/entities/consultation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduleConsultant,
      ScheduleException,
      Consultation,
    ]),
  ],
  controllers: [ScheduleConsultantController],
  providers: [ScheduleConsultantService, DateUtilsService],
})
export class ScheduleConsultantModule {}
