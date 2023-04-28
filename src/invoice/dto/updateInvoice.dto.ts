import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateInvoiceDto {
  @IsOptional()
  id?: number;

  amount: number;
}
