"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.loginValidationRules = exports.signupValidationRules = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("../utils");
dotenv_1.default.config();
const signupValidationRules = () => {
    return [
        (0, express_validator_1.body)('email')
            .notEmpty()
            .withMessage('email is required')
            .isEmail()
            .withMessage('email must be a valid email address'),
        (0, express_validator_1.body)('password')
            .notEmpty()
            .withMessage('password is required')
            .isLength({ min: 6 })
            .withMessage('password must be at least 6 characters long'),
    ];
};
exports.signupValidationRules = signupValidationRules;
const loginValidationRules = () => {
    return [
        (0, express_validator_1.body)('email')
            .notEmpty()
            .withMessage('email is required')
            .isEmail()
            .withMessage('email must be a valid email address'),
        (0, express_validator_1.body)('password').notEmpty().withMessage('password is required'),
    ];
};
exports.loginValidationRules = loginValidationRules;
const validateToken = (req, res, next) => {
    var _a;
    const jwtSecret = process.env.JWT_SECRET;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(utils_1.HttpStatus.UNAUTHORIZED).json((0, utils_1.ApiResponseFormatter)({
            message: 'Unauthorized: Token not provided',
            successResponse: false,
        }));
    }
    // Verify the token
    jsonwebtoken_1.default.verify(token, `${jwtSecret}`, (err, user) => {
        if (err) {
            return res.status(utils_1.HttpStatus.UNAUTHORIZED).json((0, utils_1.ApiResponseFormatter)({
                message: 'Unauthorized: Invalid Token',
                successResponse: false,
            }));
        }
        req.user = user;
        next();
    });
};
exports.validateToken = validateToken;
