import { Module } from '@nestjs/common';
import { CustomerAuthModule } from './customer/customer-auth.module';
import { ConsultantAuthModule } from './consultant/consultant-auth.module';

@Module({
  imports: [CustomerAuthModule, ConsultantAuthModule],
})
export class BaseAuthModule {}
