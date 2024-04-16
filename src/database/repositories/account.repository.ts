import knex from '../database';

export class AccountRepository {
  table = 'accounts';

  async findByUserId(userId: number) {
    return knex(this.table).where({ user_id: userId }).first();
  }

  async createAccount(userId: number) {
    return knex(this.table).insert({ user_id: userId });
  }
}
