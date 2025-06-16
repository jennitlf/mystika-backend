import { Injectable } from '@nestjs/common';
import { BaseAuthService } from '../base-auth.service';
import { UserService } from 'src/features/customer/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AwsS3Service } from 'src/features/aws-s3/aws-s3.service';
import { EmailService } from 'src/features/email/email.service';

@Injectable()
export class CustomerAuthService extends BaseAuthService<UserService> {
  constructor(jwtService: JwtService, userService: UserService, awsS3Service: AwsS3Service, emailService: EmailService) {
    super(jwtService, userService, awsS3Service, emailService);
  }
}