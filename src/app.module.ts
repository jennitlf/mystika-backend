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


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }), 
    DatabaseModule,
    ConsultantModule, 
    SpecialtyModule, 
    ConsultantSpecialtyModule, GeneralFindModule, UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
