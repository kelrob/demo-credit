import { TransactionRequestDto } from '../../dto/transaction.dto';

export class TransactionRepository {
  table = 'transactions';

  async newTransactionHistory(data: TransactionRequestDto, trx: any) {
    return trx(this.table).insert({
      from_account_id: data.fromAccountId,
      to_account_id: data.toAccountId,
      amount: data.amount,
      type: data.type,
    });
  }
}
