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
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const utils_1 = require("../utils");
class AuthController {
    constructor() {
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { status, response } = yield this.authService.signup(req.body);
            return res.status(status).json((0, utils_1.ApiResponseFormatter)(response));
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { status, response } = yield this.authService.login(req.body);
            return res.status(status).json((0, utils_1.ApiResponseFormatter)(response));
        });
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
