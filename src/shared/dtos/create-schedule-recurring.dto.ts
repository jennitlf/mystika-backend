import { IsString, IsNumber, IsNotEmpty, IsISO8601, IsArray } from 'class-validator';

export class CreateScheduleRecurringDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id_consultant_specialty: number;

  @IsNotEmpty()
  @IsISO8601()
  readonly start_date: string;

  @IsNotEmpty()
  @IsISO8601()
  readonly end_date: string;

  @IsNotEmpty()
  @IsArray()
  readonly days_of_week: number[]; // 0: Domingo, 1: Segunda, etc.

  @IsNotEmpty()
  @IsString()
  readonly hour_initial: string;

  @IsNotEmpty()
  @IsString()
  readonly hour_end: string;

  @IsNotEmpty()
  @IsString()
  readonly status: string;
}