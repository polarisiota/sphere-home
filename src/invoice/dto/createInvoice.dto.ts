import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsEmail()
  payerEmail: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
