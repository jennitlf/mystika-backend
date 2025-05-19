import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConsultantModule } from './features/consultant/consultant/consultant.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SpecialtyModule } from './features/customer/specialty/specialty.module';
import { ConsultantSpecialtyModule } from './features/customer/consultant-specialty/consultant-specialty.module';
import { AppController } from './app.controller';
import { GeneralFindModule } from './features/customer/general-find/general-find.module';
import { UserModule } from './features/customer/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleConsultantModule } from './features/customer/schedule-consultant/schedule-consultant.module';
import { ScheduleExceptionModule } from './features/customer/schedule-exception/schedule-exception.module';
import { ConsultationModule } from './features/customer/consultation/consultation.module';
import { CosultantSupportModule } from './features/consultant/cosultant-support/cosultant-support.module';
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
    CosultantSupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
