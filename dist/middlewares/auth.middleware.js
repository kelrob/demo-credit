"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidationRules = void 0;
const express_validator_1 = require("express-validator");
const dotenv_1 = __importDefault(require("dotenv"));
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
