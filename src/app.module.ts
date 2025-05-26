import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConsultantModule } from './features/consultant/consultant/consultant.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SpecialtyModule } from './features/consultant/specialty/specialty.module';
import { ConsultantSpecialtyModule } from './features/consultant/consultant-specialty/consultant-specialty.module';
import { AppController } from './app.controller';
import { GeneralFindModule } from './features/customer/general-find/general-find.module';
import { UserModule } from './features/customer/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleConsultantModule } from './features/consultant/schedule-consultant/schedule-consultant.module';
import { ScheduleExceptionModule } from './features/consultant/schedule-exception/schedule-exception.module';
import { ConsultationModule } from './features/customer/consultation/consultation.module';
import { ConsultantSupportModule } from './features/consultant/consultant-support/cosultant-support.module';
import { CustomerSupportModule } from './features/customer/customer-support/customer-support.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    ConsultantModule,
    SpecialtyModule,
    ConsultantSpecialtyModule,
    GeneralFindModule,
    UserModule,
    AuthModule,
    ScheduleConsultantModule,
    ScheduleExceptionModule,
    ConsultationModule,
    CustomerSupportModule,
    ConsultantSupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
