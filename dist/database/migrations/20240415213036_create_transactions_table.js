"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'transactions';
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.createTable(tableName, (table) => {
            table.increments('id').primary();
            table.integer('from_account_id').unsigned();
            table.foreign('from_account_id').references('accounts.id');
            table.integer('to_account_id').unsigned();
            table.foreign('to_account_id').references('accounts.id');
            table.bigInteger('amount').notNullable();
            table.enum('type', ['deposit', 'withdrawal', 'transfer']).notNullable();
            table.timestamps(true, true);
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.dropTable(tableName);
    });
}
exports.down = down;
