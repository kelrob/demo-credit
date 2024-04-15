"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().forEach((err) => {
        const param = err.msg.split(' ')[0];
        extractedErrors.push({ [param]: err.msg });
    });
    return res.status(utils_1.HttpStatus.UNPROCESSABLE_ENTITY).json({
        errors: extractedErrors,
    });
};
exports.validate = validate;
