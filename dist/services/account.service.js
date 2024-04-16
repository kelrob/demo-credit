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
exports.AccountService = void 0;
const account_repository_1 = require("../database/repositories/account.repository");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
class AccountService {
    constructor() {
        this.accountRepository = new account_repository_1.AccountRepository();
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
}
exports.AccountService = AccountService;
