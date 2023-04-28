import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateInvoiceDto {
  payerEmail?: string;
}
