"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ConflictException = exports.PaymentRequiredException = exports.UnauthorizedException = exports.ForbiddenException = exports.BadRequestException = void 0;
const utils_1 = require("../utils");
class BadRequestException extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestException';
    }
}
exports.BadRequestException = BadRequestException;
class ForbiddenException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ForbiddenException';
    }
}
exports.ForbiddenException = ForbiddenException;
class UnauthorizedException extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedException';
    }
}
exports.UnauthorizedException = UnauthorizedException;
class PaymentRequiredException extends Error {
    constructor(message) {
        super(message);
        this.name = 'PaymentRequiredException';
    }
}
exports.PaymentRequiredException = PaymentRequiredException;
class ConflictException extends Error {
    constructor(message, data) {
        super(message);
        this.data = data;
        this.name = 'ConflictException';
    }
}
exports.ConflictException = ConflictException;
function errorHandler(error) {
    let status;
    let message;
    let responseData;
    if (error instanceof BadRequestException) {
        status = utils_1.HttpStatus.BAD_REQUEST;
        message = error.message;
    }
    else if (error instanceof ForbiddenException) {
        status = utils_1.HttpStatus.FORBIDDEN;
        message = error.message;
    }
    else if (error instanceof UnauthorizedException) {
        status = utils_1.HttpStatus.UNAUTHORIZED;
        message = error.message;
    }
    else if (error instanceof ConflictException) {
        status = utils_1.HttpStatus.CONFLICT;
        message = error.message;
        responseData = error.data; // Changed 'data' to 'responseData'
    }
    else if (error instanceof PaymentRequiredException) {
        status = utils_1.HttpStatus.PAYMENT_REQUIRED;
        message = error.message;
    }
    else {
        status = utils_1.HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal Server Error';
    }
    return {
        status,
        response: {
            message,
            successResponse: false,
            data: responseData,
        },
    };
}
exports.errorHandler = errorHandler;
