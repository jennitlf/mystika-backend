import { Module } from '@nestjs/common';
import { CustomerAuthController } from './customer-auth.controller';
import { CustomerAuthService } from './customer-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/shared/entities/customer.entity';
import { UserModule } from 'src/features/customer/user/user.module';
import { AwsS3Service } from 'src/features/aws-s3/aws-s3.service';
import { EmailService } from 'src/features/email/email.service';
import { EmailModule } from 'src/features/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UserModule,
    EmailModule
  ],
  controllers: [CustomerAuthController],
  providers: [CustomerAuthService, AwsS3Service, EmailService],
})
export class CustomerAuthModule {}
