import type { Knex } from 'knex';

const tableName = 'transactions';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('from_account_id').unsigned();
    table.foreign('from_account_id').references('accounts.id');
    table.integer('to_account_id').unsigned();
    table.foreign('to_account_id').references('accounts.id');
    table.bigInteger('amount').notNullable();
    table.enum('type', ['deposit', 'withdrawal', 'transfer']).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
