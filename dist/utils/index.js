"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatus = exports.ApiResponseFormatter = void 0;
const HttpStatus = {
    OK: 200,
};
exports.HttpStatus = HttpStatus;
const ApiResponseFormatter = (response) => {
    const { data = null, successResponse = true, message = 'Data Retrieved' } = response;
    return { message, successResponse, data };
};
exports.ApiResponseFormatter = ApiResponseFormatter;
