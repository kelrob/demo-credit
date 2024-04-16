import knex from '../database';
import { ChangeAccountBalanceRequestDto } from '../../dto/account.dto';

export class AccountRepository {
  table = 'accounts';

  async findByUserId(userId: number, trx?: any) {
    if (trx) {
      return trx(this.table).where({ user_id: userId }).first();
    }

    return knex(this.table).where({ user_id: userId }).first();
  }

  async createAccount(userId: number) {
    return knex(this.table).insert({ user_id: userId });
  }

  async fundAccount(data: ChangeAccountBalanceRequestDto, trx: any) {
    return trx(this.table)
      .where('id', data.id)
      .andWhere('user_id', data.userId)
      .increment('balance', data.amount)
      .update('version', data.version + 1);
  }

  async debitAccount(data: ChangeAccountBalanceRequestDto, trx: any) {
    return trx(this.table)
      .where('id', data.id)
      .andWhere('user_id', data.userId)
      .decrement('balance', data.amount)
      .update('version', data.version + 1);
  }
}
