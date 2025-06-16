import { Module } from '@nestjs/common';
import { ConsultantAuthService } from './consultant-auth.service';
import { ConsultantAuthController } from './consultant-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultantModule } from 'src/features/consultant/consultant/consultant.module';
import { Consultant } from 'src/shared/entities/consultant.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsS3Service } from 'src/features/aws-s3/aws-s3.service';
import { EmailModule } from 'src/features/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Consultant]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
  }),
  ConsultantModule,
  EmailModule
  ],
  controllers: [ConsultantAuthController],
  providers: [ConsultantAuthService, AwsS3Service],
})
export class ConsultantAuthModule {}
