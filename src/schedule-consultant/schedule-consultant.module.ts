import { Module } from '@nestjs/common';
import { ScheduleConsultantService } from './schedule-consultant.service';
import { ScheduleConsultantController } from './schedule-consultant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleConsultant } from 'src/shared/entities/schedule_consultant.entity';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ScheduleConsultant, ScheduleException])],
  controllers: [ScheduleConsultantController],
  providers: [ScheduleConsultantService],
})
export class ScheduleConsultantModule {}
