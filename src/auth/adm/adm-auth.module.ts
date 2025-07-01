import { Module } from '@nestjs/common';
import { AdmAuthService } from './adm-auth.service';
import { AdmAuthController } from './adm-auth.controller';
import { EmailService } from 'src/features/email/email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adm } from 'src/shared/entities/adm.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Adm]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AdmAuthController],
  providers: [AdmAuthService, EmailService],
})
export class AdmAuthModule {}
