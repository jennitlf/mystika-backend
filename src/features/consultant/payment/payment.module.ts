import { forwardRef, MiddlewareConsumer, Module, RequestMethod, NestModule } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultant } from 'src/shared/entities/consultant.entity';
import { DecodeTokenMiddleware } from 'src/middlewares/decode-token.moddleware';
import { PaymentMethodsCustomer } from 'src/shared/entities/payment_methods_customer.entity';
import { Payment } from 'src/shared/entities/payments.entity';
import { Customer } from 'src/shared/entities/customer.entity';
import { ConsultationModule } from 'src/features/customer/consultation/consultation.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MercadoPagoConfig } from 'mercadopago';
import { RawBodyMiddleware } from 'src/middlewares/raw-body.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Consultant,
      PaymentMethodsCustomer,
      Payment,
      Customer,
    ]),
    forwardRef(() => ConsultationModule),
    ConfigModule
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'MERCADO_PAGO_SDK',
      useFactory: (configService: ConfigService) => {
        return new MercadoPagoConfig({
          accessToken: configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodeTokenMiddleware)
      .forRoutes(
        { path: 'payments/card', method: RequestMethod.POST },
        { path: 'payments/pix', method: RequestMethod.POST },
        { path: 'payments/boleto', method: RequestMethod.POST }
      );
      // consumer
      // .apply(RawBodyMiddleware)
      // .forRoutes({ path: 'payments/webhook', method: RequestMethod.POST });
  }
}