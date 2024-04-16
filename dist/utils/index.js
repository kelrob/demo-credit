"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatus = exports.ApiResponseFormatter = void 0;
const HttpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 400,
};
exports.HttpStatus = HttpStatus;
const ApiResponseFormatter = (response) => {
    const { data = null, successResponse = true, message = 'Data Retrieved' } = response;
    return { message, successResponse, data };
};
exports.ApiResponseFormatter = ApiResponseFormatter;
