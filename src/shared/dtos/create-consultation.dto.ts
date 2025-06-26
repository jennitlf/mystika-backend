import { IsString, IsNumber, IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id_schedule_consultant: number;

  @IsNotEmpty()
  @IsISO8601()
  readonly appoinment_date_time: string;

  @IsNotEmpty()
  @IsString()
  readonly appoinment_time: string;

  @IsNotEmpty()
  @IsISO8601()
  readonly appoinment_date: string;

  readonly status: string;

  readonly attended: string;
}
