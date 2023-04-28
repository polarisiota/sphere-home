import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  async create(): Transaction {
    throw 'not implemented';
  }

  async retrieve() {
    throw 'not implemented';
  }
}
