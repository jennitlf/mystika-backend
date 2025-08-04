import {
    IsString,
    IsNumber,
    IsEmail,
    IsNotEmpty,
    ValidateNested,
    IsOptional,
    Min,
    Matches
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class PayerIdentificationDto {
    @IsNotEmpty()
    @IsString()
    type: string; //  CPF ou CNPJ
  
    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]+$/, { message: 'identification.number must contain only digits' })
    number: string; // 12345678900
  }
  
  // endereço do pagador
  class PayerAddressDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]{8}$/, { message: 'zip_code must be 8 digits' })
    zip_code: string;
  
    @IsNotEmpty()
    @IsString()
    street_name: string;
  
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    street_number: string;
  
    @IsOptional()
    @IsString()
    neighborhood?: string;
  
    @IsOptional()
    @IsString()
    city?: string;
  
    @IsOptional()
    @IsString()
    federal_unit?: string;
  }
  
  class PayerBoletoDto {
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
  
    @IsOptional()
    @ValidateNested()
    @Type(() => PayerAddressDto)
    address?: PayerAddressDto;
  }
  
  export class CreatePaymentBoletoDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0.01)
    transaction_amount: number;
  
    @IsNotEmpty()
    @IsString()
    description: string;
    
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PayerBoletoDto)
    payer: PayerBoletoDto;
  
  }