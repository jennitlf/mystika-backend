import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConsultantModule } from './consultant/consultant.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SpecialtyModule } from './specialty/specialty.module';
import { ConsultantSpecialtyModule } from './consultant-specialty/consultant-specialty.module';
import { AppController } from './app.controller';
import { GeneralFindModule } from './general-find/general-find.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleConsultantModule } from './schedule-consultant/schedule-consultant.module';
import { ScheduleExceptionModule } from './schedule-exception/schedule-exception.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    AuthModule, 
    DatabaseModule,
    ConsultantModule, 
    SpecialtyModule, 
    ConsultantSpecialtyModule, GeneralFindModule, UserModule, AuthModule, ScheduleConsultantModule, ScheduleExceptionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
