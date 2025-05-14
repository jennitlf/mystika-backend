import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleRecurringDto } from './create-schedule-recurring.dto';

export class UpdateScheduleRecurringDto extends PartialType(
  CreateScheduleRecurringDto,
) {}
