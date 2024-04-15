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
exports.AuthService = void 0;
const utils_1 = require("../utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = require("../database/repositories/user.repository");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const exceptions_1 = require("../exceptions");
dotenv_1.default.config();
class AuthService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    signup(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = body;
            try {
                const existingUser = yield this.userRepository.findByEmail(email);
                // Check if user in Karma Blacklist
                const userBlacklisted = yield this.checkIfUserBlacklisted(email);
                if (userBlacklisted) {
                    throw new exceptions_1.ForbiddenException('Forbidden Resource');
                }
                if (existingUser) {
                    throw new exceptions_1.BadRequestException('User with Email already exists');
                }
                // Hash the password
                body.password = yield bcrypt_1.default.hash(password, 10);
                // Insert the new user into the database
                yield this.userRepository.createUser(body);
                return {
                    status: utils_1.HttpStatus.CREATED,
                    response: {
                        message: 'User Created Successfully',
                        successResponse: true,
                        data: { email },
                    },
                };
            }
            catch (error) {
                return (0, exceptions_1.errorHandler)(error);
            }
        });
    }
    checkIfUserBlacklisted(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const adjutorBaseUrl = process.env.ADJUTOR_BASE_URL;
            const adjutorApiKey = process.env.ADJUTOR_API_KEY;
            try {
                yield axios_1.default.get(`${adjutorBaseUrl}verification/karma/${email}`, {
                    headers: {
                        Authorization: `Bearer ${adjutorApiKey}`,
                    },
                });
                return true;
            }
            catch (error) {
                return error.response.status !== 404;
            }
        });
    }
}
exports.AuthService = AuthService;
