import { Injectable } from '@nestjs/common';
import { Invoice, User } from '@prisma/client';
import { InvoiceStatus } from 'src/helper/constants.helper';
import { PaymentService } from 'src/payment/payment.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(
    private paymentService: PaymentService,
    private userService: UserService,
    private transactionService: TransactionService,
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateInvoiceDto, receiver: User): Promise<Invoice> {
    const payer = await this.userService.retrieveByEmail(dto.payerEmail);

    const invoice = await this.prisma.invoice.create({
      data: {
        amount: dto.amount,
        status: InvoiceStatus.INITIAL,
        payer: {
          connect: {
            id: payer.id,
          },
        },
        receriver: {
          connect: {
            id: receiver.id,
          },
        },
      },
    });

    return invoice;
  }

  async retrieve(invoiceId: number): Promise<Invoice> {
    return await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
      },
    });
  }

  async setStatus(invoiceId: number, status: InvoiceStatus): Promise<Invoice> {
    return await this.prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status,
      },
    });
  }

  async update(dto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.prisma.invoice.update({
      where: {
        id: dto.id,
      },
      data: {
        amount: dto.amount,
      },
    });

    return invoice;
  }

  async checkout(
    invoiceId: number,
    amount: bigint,
    payer: User,
  ): Promise<Invoice> {
    const invoice = await this.retrieve(invoiceId);
    if (Number(invoice.amount) !== Number(amount))
      throw new Error('Amount not matched');

    if (invoice.status !== InvoiceStatus.INITIAL) {
      throw new Error('Invoice was already processed');
    }

    const receiver = await this.userService.retrieve(invoice.receiverId);
    if (!payer || !receiver) throw new Error('User not found');

    await this.paymentService.pay(amount, payer, receiver, invoiceId);

    return await this.setStatus(invoiceId, InvoiceStatus.PAID);
  }
}
