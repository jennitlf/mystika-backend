import { IsString, IsNumber, IsNotEmpty, IsISO8601 } from 'class-validator';

export default class CreateScheduleExceptionDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id_schedule_consultant: number;

  @IsNotEmpty()
  @IsISO8601()
  readonly date_exception: string;

  @IsNotEmpty()
  @IsISO8601()
  readonly unavailable_date_time: string

  @IsNotEmpty()
  @IsString()
  readonly unavailable_time: string;

  @IsNotEmpty()
  @IsString()
  readonly reason: string;
}
