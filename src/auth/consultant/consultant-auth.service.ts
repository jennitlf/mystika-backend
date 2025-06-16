import { Injectable } from '@nestjs/common';
import { BaseAuthService } from '../base-auth.service';
import { ConsultantService } from '../../features/consultant/consultant/consultant.service';
import { JwtService } from '@nestjs/jwt';
import { AwsS3Service } from 'src/features/aws-s3/aws-s3.service';
import { EmailService } from 'src/features/email/email.service';

@Injectable()
export class ConsultantAuthService extends BaseAuthService<ConsultantService> {
  constructor(jwtService: JwtService, consultantService: ConsultantService, awsS3Service: AwsS3Service, emailService: EmailService) {
    super(jwtService, consultantService, awsS3Service, emailService);
  }
}