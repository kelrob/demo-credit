"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ForbiddenException = exports.BadRequestException = void 0;
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
    else {
        status = utils_1.HttpStatus.INTERNAL_SERVER_ERROR;
        message = error.message || 'Internal Server Error';
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
