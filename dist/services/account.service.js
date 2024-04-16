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
exports.AccountService = void 0;
const account_repository_1 = require("../database/repositories/account.repository");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const database_1 = __importDefault(require("../database/database"));
const transaction_repository_1 = require("../database/repositories/transaction.repository");
const transaction_dto_1 = require("../dto/transaction.dto");
class AccountService {
    constructor() {
        this.accountRepository = new account_repository_1.AccountRepository();
        this.transactionRepository = new transaction_repository_1.TransactionRepository();
    }
    createAccount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if user already has an account
                const accountExists = yield this.accountRepository.findByUserId(userId);
                if (accountExists) {
                    throw new exceptions_1.BadRequestException(`Account already created for this user`);
                }
                // Create account
                yield this.accountRepository.createAccount(userId);
                return {
                    status: utils_1.HttpStatus.CREATED,
                    response: {
                        message: 'Account Created Successfully',
                        successResponse: true,
                    },
                };
            }
            catch (error) {
                return (0, exceptions_1.errorHandler)(error);
            }
        });
    }
    fundAccount(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const MAX_RETRIES = 5;
            const { userId } = body;
            const amount = body.amount * 100;
            let version = body.version;
            try {
                let retries = 0;
                let versionToUse;
                while (retries < MAX_RETRIES) {
                    let trx;
                    try {
                        // Start transaction
                        trx = yield database_1.default.transaction();
                        // Get current user account within transaction
                        const currentUserAccount = yield this.accountRepository.findByUserId(userId, trx);
                        if (!currentUserAccount) {
                            throw new exceptions_1.BadRequestException('User does not have an account');
                        }
                        versionToUse = currentUserAccount.version;
                        // Check for optimistic concurrency control
                        if (versionToUse !== version) {
                            throw new exceptions_1.ConflictException('Conflict: Account version mismatch');
                        }
                        // Fund user account within the transaction
                        yield this.accountRepository.fundAccount({
                            amount,
                            id: currentUserAccount.id,
                            userId,
                            version,
                        }, trx);
                        // Store in transaction history
                        yield this.transactionRepository.newTransactionHistory({
                            amount,
                            type: transaction_dto_1.TransactionType.DEPOSIT,
                            toAccountId: currentUserAccount.id,
                        }, trx);
                        // Commit transaction
                        yield trx.commit();
                        return {
                            status: utils_1.HttpStatus.OK,
                            response: {
                                message: 'Account funded successfully',
                                successResponse: true,
                            },
                        };
                    }
                    catch (error) {
                        if (trx) {
                            yield trx.rollback();
                        }
                        // Increment version for next retry
                        if (error instanceof exceptions_1.ConflictException) {
                            version++;
                            retries++;
                        }
                        else {
                            retries = MAX_RETRIES;
                            return (0, exceptions_1.errorHandler)(error);
                        }
                    }
                }
                throw new exceptions_1.ConflictException('Failed to fund account after maximum retries.', { versionToUse });
            }
            catch (error) {
                return (0, exceptions_1.errorHandler)(error);
            }
        });
    }
}
exports.AccountService = AccountService;
