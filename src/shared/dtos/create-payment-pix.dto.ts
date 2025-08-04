import {
    IsString,
    IsNumber,
    IsEmail,
    IsNotEmpty,
    ValidateNested,
    IsOptional,
    Min,
  } from 'class-validator';
  import { Type } from 'class-transformer';
import { PayerIdentificationDto } from './create-payment-boleto.dto';

  class PayerPixDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsOptional()
    @IsString()
    first_name?: string;
  
    @IsOptional()
    @IsString()
    last_name?: string;
  
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PayerIdentificationDto)
    identification: PayerIdentificationDto;
  }
  
  export class CreatePaymentPixDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0.01)
    transaction_amount: number;
  
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PayerPixDto)
    payer: PayerPixDto;
  
  }