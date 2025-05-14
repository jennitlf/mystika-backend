import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultantSpecialtyDto } from './create-consultant-specialty.dto';

export class UpdateConsultantSpecialtyDto extends PartialType(
  CreateConsultantSpecialtyDto,
) {}
