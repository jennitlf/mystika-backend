import { ValidateNested, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateConsultationDto } from './create-consultation.dto';
import { PaymentCardDto } from './payment-card.dto';
import { PaymentPixDto } from './payment-pix.dto';
import { PaymentBoletoDto } from './payment-boleto.dto';

export class ConsultationWithPaymentPix {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateConsultationDto)
  createConsultationDto: CreateConsultationDto;

  @IsNotEmpty()
  @ValidateNested()
  paymentDetails: PaymentPixDto;
}

export class ConsultationWithPaymentCard {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateConsultationDto)
  createConsultationDto: CreateConsultationDto;

  @IsNotEmpty()
  @ValidateNested()
  paymentDetails: PaymentCardDto;
}

export class ConsultationWithPaymentBoleto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateConsultationDto)
  createConsultationDto: CreateConsultationDto;

  @IsNotEmpty()
  @ValidateNested()
  paymentDetails: PaymentBoletoDto;
}
