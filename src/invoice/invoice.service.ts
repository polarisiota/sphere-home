import { Injectable } from '@nestjs/common';
import { Invoice, User } from '@prisma/client';
import { InvoiceStatus } from 'src/helper/constants.helper';
import { PaymentService } from 'src/payment/payment.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto';

@Injectable()
export class InvoiceService {
  constructor(
    private paymentService: PaymentService,
    private userService: UserService,
    private transactionService: TransactionService,
  ) {}

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    // create invoice from data
    throw 'not implemented';
  }

  async retrieve(invoiceId: number): Promise<Invoice> {
    throw 'not implemented';
  }

  async setStatus(invoiceId: number, status: InvoiceStatus): Promise<Invoice> {
    throw 'not implemented';
  }

  async update(dto: UpdateInvoiceDto): Promise<Invoice> {
    throw 'not implemented';
  }

  async checkout(invoiceId: number, amount: bigint, payer: User) {
    const invoice = await this.retrieve(invoiceId);
    // TODO check amount type
    if (invoice.amount !== amount) {
      throw new Error('Amount not matched');
    }
    if (invoice.status !== InvoiceStatus.INITIAL) {
      throw new Error('Invoice was already processed');
    }
    const receiver = await this.userService.retrieve(invoice.receiverId);
    if (!payer || !receiver) throw new Error('User not found');

    const transaction = await this.paymentService.pay(amount, payer, receiver);
    transaction.invoiceId = invoiceId;
    await this.transactionService.update(transaction);
    await this.setStatus(invoiceId, InvoiceStatus.PAID);
  }
}
