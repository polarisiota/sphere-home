import { Injectable } from '@nestjs/common';
import { Invoice, User } from '@prisma/client';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class InvoiceService {
  constructor(private paymentService: PaymentService) {}

  async create() {
    // create invoice from data
    throw 'not implemented';
  }

  async retrieve(invoiceId: number): Promise<Invoice> {
    throw 'not implemented';
  }

  async setStatus() {
    throw 'not implemented';
  }
}
