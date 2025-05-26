import { Module } from '@nestjs/common';
import { ScheduleExceptionService } from './schedule-exception.service';
import { ScheduleExceptionController } from './schedule-exception.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';
import { ScheduleConsultant } from 'src/shared/entities/schedule_consultant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleException, ScheduleConsultant])],
  controllers: [ScheduleExceptionController],
  providers: [ScheduleExceptionService],
})
export class ScheduleExceptionModule {}
