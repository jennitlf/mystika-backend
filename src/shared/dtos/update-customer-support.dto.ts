import { PartialType } from '@nestjs/swagger';
import { CreateCustomerSupportDto } from './create-customer-support.dto';

export class UpdateCustomerSupportDto extends PartialType(
  CreateCustomerSupportDto,
) {}
