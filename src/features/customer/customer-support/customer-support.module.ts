import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CustomerSupportService } from './customer-support.service';
import { CustomerSupportController } from './customer-support.controller';
import { CustomerSupport } from 'src/shared/entities/customer_support.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecodeTokenMiddleware } from 'src/middlewares/decode-token.moddleware';
import { ConsultantSupportModule } from 'src/features/consultant/consultant-support/cosultant-support.module';


@Module({
  imports: [TypeOrmModule.forFeature([CustomerSupport])],
  controllers: [CustomerSupportController],
  providers: [CustomerSupportService],
  exports: [CustomerSupportService],
})
export class CustomerSupportModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodeTokenMiddleware)
      .forRoutes({ path: 'customer-support*', method: RequestMethod.ALL });
  }
}
