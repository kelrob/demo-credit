"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.PaymentRequiredException = exports.ConflictException = exports.UnauthorizedException = exports.ForbiddenException = exports.BadRequestException = exports.HttpException = void 0;
const utils_1 = require("../utils");
class HttpException extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = this.constructor.name;
    }
}
exports.HttpException = HttpException;
class BadRequestException extends HttpException {
    constructor(message) {
        super(message, utils_1.HttpStatus.BAD_REQUEST);
    }
}
exports.BadRequestException = BadRequestException;
class ForbiddenException extends HttpException {
    constructor(message) {
        super(message, utils_1.HttpStatus.FORBIDDEN);
    }
}
exports.ForbiddenException = ForbiddenException;
class UnauthorizedException extends HttpException {
    constructor(message) {
        super(message, utils_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ConflictException extends HttpException {
    constructor(message, data) {
        super(message, utils_1.HttpStatus.CONFLICT, data);
    }
}
exports.ConflictException = ConflictException;
class PaymentRequiredException extends HttpException {
    constructor(message) {
        super(message, utils_1.HttpStatus.PAYMENT_REQUIRED);
    }
}
exports.PaymentRequiredException = PaymentRequiredException;
function errorHandler(error) {
    let status;
    let message;
    if (error instanceof HttpException) {
        status = error.status;
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
            data: error instanceof ConflictException ? error.data : undefined,
        },
    };
}
exports.errorHandler = errorHandler;
