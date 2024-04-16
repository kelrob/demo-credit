"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundAccountValidationRules = void 0;
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
