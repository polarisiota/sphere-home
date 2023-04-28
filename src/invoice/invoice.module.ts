import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { PaymentModule } from 'src/payment/payment.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports: [PaymentModule, TransactionModule, UserModule],
})
export class InvoiceModule {}
