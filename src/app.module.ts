import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConsultantModule } from './features/consultant/consultant/consultant.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SpecialtyModule } from './features/consultant/specialty/specialty.module';
import { ConsultantSpecialtyModule } from './features/consultant/consultant-specialty/consultant-specialty.module';
import { AppController } from './app.controller';
import { GeneralFindModule } from './features/customer/general-find/general-find.module';
import { UserModule } from './features/customer/user/user.module';
import { BaseAuthModule } from './auth/base-auth.module';
import { ScheduleConsultantModule } from './features/consultant/schedule-consultant/schedule-consultant.module';
import { ScheduleExceptionModule } from './features/consultant/schedule-exception/schedule-exception.module';
import { ConsultationModule } from './features/customer/consultation/consultation.module';
import { ConsultantSupportModule } from './features/consultant/consultant-support/cosultant-support.module';
import { CustomerSupportModule } from './features/customer/customer-support/customer-support.module';
import { EmailModule } from './features/email/email.module';
import { AwsS3Module } from './features/aws-s3/aws-s3.module';
import { AdmAuthModule } from './auth/adm/adm-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ConsultantModule,
    SpecialtyModule,
    ConsultantSpecialtyModule,
    GeneralFindModule,
    UserModule,
    BaseAuthModule,
    AdmAuthModule,
    ScheduleConsultantModule,
    ScheduleExceptionModule,
    ConsultationModule,
    CustomerSupportModule,
    ConsultantSupportModule,
    EmailModule,
    AwsS3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply((req, res, next) => {
      if (req.url === '/favicon.ico') {
        res.status(204).end();
      } else {
        next();
      }
    }).forRoutes('*');
  }
}
