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
exports.AccountController = void 0;
const utils_1 = require("../utils");
const account_service_1 = require("../services/account.service");
class AccountController {
    constructor() {
        this.createAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { status, response } = yield this.accountService.createAccount(req.user.id);
            return res.status(status).json((0, utils_1.ApiResponseFormatter)(response));
        });
        this.fundAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = Object.assign({ userId: req.user.id }, req.body);
            const { status, response } = yield this.accountService.fundAccount(body);
            return res.status(status).json((0, utils_1.ApiResponseFormatter)(response));
        });
        this.accountService = new account_service_1.AccountService();
    }
}
exports.AccountController = AccountController;
