import { Injectable } from '@nestjs/common';
import { Transaction, User } from '@prisma/client';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class PaymentService {
  constructor(private transactionService: TransactionService) {}
  async pay(amount: bigint, payer: User, receiver: User): Promise<Transaction> {
    // we can call third party service or access solana chain
    // TODO create transaction from user and amount

    const success = true;

    if (success) {
      return await this.transactionService.create();
    } else {
      throw new Error('Payment Failed');
    }
  }
}
