import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  async create(): Promise<Transaction> {
    throw 'not implemented';
  }

  async retrieve() {
    throw 'not implemented';
  }

  async update(transaction: Transaction): Promise<Transaction> {
    throw 'not implemented';
  }
}
