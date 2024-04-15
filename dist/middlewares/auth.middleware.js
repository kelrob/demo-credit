"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidationRules = exports.signupValidationRules = void 0;
const express_validator_1 = require("express-validator");
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
