import { Type } from 'class-transformer';
import {
    IsString,
    IsNumber,
    IsNotEmpty,
    Min,
    ValidateNested,
    Matches,
    IsOptional,
  } from 'class-validator';

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
    @ValidateNested()
    @Type(() => PayerAddressDto)
    address?: PayerAddressDto;
  }
  
  export class PaymentBoletoDto {
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