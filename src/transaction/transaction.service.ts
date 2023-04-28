import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(invoiceId: number): Promise<Transaction> {
    return await this.prisma.transaction.create({
      data: {
        invoice: {
          connect: {
            id: invoiceId,
          },
        },
      },
    });
  }

  async retrieve() {
    throw 'not implemented';
  }

  async update(transaction: Transaction): Promise<Transaction> {
    throw 'not implemented';
  }
}
