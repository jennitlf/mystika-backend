import { Module } from '@nestjs/common';
import { CustomerAuthModule } from './customer/customer-auth.module';
import { ConsultantAuthModule } from './consultant/consultant-auth.module';
import { AwsS3Service } from 'src/features/aws-s3/aws-s3.service';
import { EmailService } from 'src/features/email/email.service';

@Module({
  imports: [CustomerAuthModule, ConsultantAuthModule],
  providers: [AwsS3Service, EmailService]
})
export class BaseAuthModule {}
