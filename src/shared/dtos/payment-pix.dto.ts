import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class PaymentPixDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0.01)
    transaction_amount: number;
  
    @IsNotEmpty()
    @IsString()
    description: string;  
  }