import {
  IsString,
  IsNumber,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  Min,
  Max,
  Matches
} from 'class-validator';
import { Type } from 'class-transformer';

// identificação do pagador
class PayerIdentificationDto {
  @IsNotEmpty()
  @IsString()
  type: string; //  CPF ou CNPJ

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'identification.number must contain only digits' })
  number: string;
}

// dados do pagador
class PayerCardDto {
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

export class CreatePaymentCardDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  transaction_amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(24) 
  installments: number;

  @IsOptional()
  @IsString()
  issuer_id?: number; // ID do banco emissor, opcional

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PayerCardDto)
  payer: PayerCardDto;

}