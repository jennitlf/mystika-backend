import { IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateConsultantSpecialtyDto {

  @IsNotEmpty()
  @IsNumber()
  readonly id_specialty: number;

  @IsNotEmpty()
  @IsNumber()
  readonly duration: number;

  @IsNotEmpty()
  @IsNumber()
  readonly value_per_duration: number;

}
