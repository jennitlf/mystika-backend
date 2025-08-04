
import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentCardDto } from '../../../shared/dtos/create-payment-card.dto';
import { Payment as PaymentEntity, PaymentMethodType, PaymentStatus } from '../../../shared/entities/payments.entity';
import { Customer } from '../../../shared/entities/customer.entity';
import { PaymentMethodsCustomer } from '../../../shared/entities/payment_methods_customer.entity';
import { ConsultationService } from '../../customer/consultation/consultation.service'; 
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { CreatePaymentPixDto } from '../../../shared/dtos/create-payment-pix.dto';
import { CreatePaymentBoletoDto } from '../../../shared/dtos/create-payment-boleto.dto';
import { returnPix, returnCard, returnBoleto } from '../../../shared/types/return-payment.types';

@Injectable()
export class PaymentService {
  private readonly payment: Payment;

  constructor(
    @Inject(forwardRef(() => ConsultationService))
    private readonly consultationService: ConsultationService,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(PaymentMethodsCustomer)
    private readonly paymentMethodsCustomerRepository: Repository<PaymentMethodsCustomer>,
    @Inject('MERCADO_PAGO_SDK')
    private readonly mercadopago: MercadoPagoConfig,
  ) {
    this.payment = new Payment(this.mercadopago);
  }

  async card(userId: string, body: CreatePaymentCardDto): Promise<returnCard> {
    try {
      const response = await this.payment.create({
        body: {
          ...body,
          notification_url: process.env.MERCADO_PAGO_NOTIFICATION_URL,
        },
      });
  
      if (!response) {
        throw new Error('Empty response from Mercado Pago');
      }
  
      const payment = this.paymentRepository.create({
        mercadopagoPaymentId: String(response.id),
        mercadopagoStatusDetail: response.status_detail,
        mercadopagoJsonResponse: response,
  
        amountPaid: response.transaction_amount,
        currency: response.currency_id,
        status: response.status as PaymentStatus,
        paymentDate: response.date_approved,
        paymentMethodType: PaymentMethodType.CARD,
  
        cardLast4: response.card?.last_four_digits || null,
        cardBrand: response.card?.cardholder?.name || null,
        cardExpMonth: response.card?.expiration_month || null,
        cardExpYear: response.card?.expiration_year || null,
      });
  
      await this.paymentRepository.save(payment);
  
      return {
        id: response.id,
        status: response.status,
        status_detail: response.status_detail,
        payer_email: response.payer?.email,
      };
    } catch (error) {
      throw new InternalServerErrorException('Não foi possível processar o pagamento. Tente novamente.');
    }
  }
  

  async pix(userId: string, body: CreatePaymentPixDto): Promise<returnPix> {
    try{
    const response = await this.payment.create({
      body: {
        ...body,
        notification_url: process.env.MERCADO_PAGO_NOTIFICATION_URL,
        payment_method_id: 'pix',
      },
    });
    const pixInfo = response.point_of_interaction?.transaction_data;
    const payment = this.paymentRepository.create({
      mercadopagoPaymentId: String(response.id),
      mercadopagoStatusDetail: response.status_detail,
      mercadopagoJsonResponse: response,
    
      amountPaid: response.transaction_amount,
      currency: response.currency_id,
      status: response.status as PaymentStatus,
      paymentDate: response.date_approved,
      paymentMethodType: PaymentMethodType.PIX,
    
      pixCode: pixInfo?.ticket_url || pixInfo?.qr_code,
      pixQrCodeUrl: pixInfo?.qr_code_base64 || null,
      expirationDate: response.date_of_expiration,
    });
    await this.paymentRepository.save(payment);
    return {
      id: response.id,
      qr_code: response.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
    };
  } catch (error) {
    throw new InternalServerErrorException('Não foi possível processar o pagamento. Tente novamente.');
  }
  }

  async boleto(userId: string, body: CreatePaymentBoletoDto): Promise<returnBoleto> {
    try {
      const response = await this.payment.create({
        body: {
          ...body,
          notification_url: process.env.MERCADO_PAGO_NOTIFICATION_URL,
          payment_method_id: 'bolbradesco',
        },
      });
      const boletoUrl = response.transaction_details?.external_resource_url;
  
      const payment = this.paymentRepository.create({
        mercadopagoPaymentId: String(response.id),
        mercadopagoStatusDetail: response.status_detail,
        mercadopagoJsonResponse: response,
  
        amountPaid: response.transaction_amount,
        currency: response.currency_id,
        status: response.status as PaymentStatus,
        paymentDate: response.date_approved,
        paymentMethodType: PaymentMethodType.BOLETO,
  
        boletoUrl: boletoUrl,
        expirationDate: response.date_of_expiration,
      });
      await this.paymentRepository.save(payment);
  
      return {
        id: response.id,
        boleto_url: boletoUrl,
        status: response.status,
        status_detail: response.status_detail,
        payer_email: response.payer?.email,
      };
  
    } catch (error) {
      console.error('Erro ao criar pagamento com boleto:', error);
      throw new Error('Erro ao processar pagamento com boleto.');
    }
  }
  
  // add id da consulta ao pagamento
  async updatePaymetAddIdConsultation(idConsultation: number, mercadopagoPaymentId: number) {
    const payment = await this.paymentRepository.findOne({
      where: { mercadopagoPaymentId: String(mercadopagoPaymentId) },
    });
    if (!payment) {
      throw new InternalServerErrorException('Pagamento não encontrado.');
    }
    payment.consultation_id = idConsultation;
    await this.paymentRepository.save(payment);

    return payment;
}


  //atualiza o status do pagamento conforme retorno do webhook do mercado pago
  async updateStatusPayment(
    paymentId: number,
    newStatus: PaymentStatus,
    statusUpdatedAt: Date,
  ) {
    
    const existingPayment = await this.paymentRepository.findOne({
      where: { mercadopagoPaymentId: String(paymentId) },
    });

    if (!existingPayment) {
      throw new InternalServerErrorException('Pagamento não encontrado.');
    }

    const result = await this.paymentRepository.update(
      existingPayment.id,
      {
        status: newStatus,
        statusUpdatedAt: statusUpdatedAt,
      },
    );

    if (result.affected === 0) {
      throw new InternalServerErrorException('Falha ao atualizar o status do pagamento.');
    }

    if (existingPayment.consultation_id) {
      await this.consultationService.updadeStatusbUpdatePayment(existingPayment.consultation_id);
    } else {
      throw new InternalServerErrorException(`Status do pagamento foi atualizado, mas não foi possível atualizar status da consulta id${existingPayment.consultation_id}.`);
    }

    return { success: true, message: 'Status do pagamento atualizado com sucesso.' };
  }

  
}
