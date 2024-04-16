"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferFundsToAccountValidationRules = exports.fundAccountValidationRules = void 0;
const express_validator_1 = require("express-validator");
const fundAccountValidationRules = () => {
    return [
        (0, express_validator_1.body)('amount')
            .notEmpty()
            .withMessage('amount is required')
            .isInt({ min: 100 })
            .withMessage('amount can only be number greater than or equal to 100'),
        (0, express_validator_1.body)('version').notEmpty().withMessage('version is required').isInt().withMessage('version can only be number'),
    ];
};
exports.fundAccountValidationRules = fundAccountValidationRules;
const transferFundsToAccountValidationRules = () => {
    return [
        (0, express_validator_1.body)('amount')
            .notEmpty()
            .withMessage('amount is required')
            .isInt({ min: 100 })
            .withMessage('amount can only be number greater than or equal to 100'),
        (0, express_validator_1.body)('receiverId')
            .notEmpty()
            .withMessage('receiverId is required')
            .isInt({ min: 1 })
            .withMessage('receiverId can only be number and greater than 0'),
        (0, express_validator_1.body)('senderVersion')
            .notEmpty()
            .withMessage('senderVersion is required')
            .isInt()
            .withMessage('senderVersion can only be number'),
        (0, express_validator_1.body)('receiverVersion')
            .notEmpty()
            .withMessage('receiverVersion is required')
            .isInt()
            .withMessage('receiverVersion can only be number'),
    ];
};
exports.transferFundsToAccountValidationRules = transferFundsToAccountValidationRules;
