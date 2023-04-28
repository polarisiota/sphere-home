import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateInvoiceDto {
  receiverId?: number;
}
