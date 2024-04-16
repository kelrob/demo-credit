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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const database_1 = __importDefault(require("../database"));
class AccountRepository {
    constructor() {
        this.table = 'accounts';
    }
    findByUserId(userId, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trx) {
                return trx(this.table).where({ user_id: userId }).first();
            }
            return (0, database_1.default)(this.table).where({ user_id: userId }).first();
        });
    }
    createAccount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.default)(this.table).insert({ user_id: userId });
        });
    }
    fundAccount(data, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            return trx(this.table)
                .where('id', data.id)
                .andWhere('user_id', data.userId)
                .increment('balance', data.amount)
                .update('version', data.version + 1);
        });
    }
    debitAccount(data, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            return trx(this.table)
                .where('id', data.id)
                .andWhere('user_id', data.userId)
                .decrement('balance', data.amount)
                .update('version', data.version + 1);
        });
    }
}
exports.AccountRepository = AccountRepository;
