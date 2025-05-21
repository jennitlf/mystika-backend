import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from 'src/shared/entities/consultation.entity';
import { ConsultantSpecialty } from 'src/shared/entities/consultant_specialty.entity';
import { Customer } from 'src/shared/entities/customer.entity';
import { DecodeTokenMiddleware } from 'src/middlewares/decode-token.moddleware';
import { CustomerSupportModule } from '../customer-support/customer-support.module';

@Module({
  imports: [
    CustomerSupportModule,
    TypeOrmModule.forFeature([Consultation, ConsultantSpecialty, Customer]),
  ],
  controllers: [ConsultationController],
  providers: [ConsultationService],
})
export class ConsultationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodeTokenMiddleware)
      .forRoutes({ path: 'consultation**', method: RequestMethod.ALL });
  }
}
