import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class PaymentCardDto{
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

}