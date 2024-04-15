"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicController = void 0;
const utils_1 = require("../utils");
class PublicController {
    index(req, res) {
        return res.redirect('/api/v1/health');
    }
    healthCheck(req, res) {
        res.status(utils_1.HttpStatus.OK).json((0, utils_1.ApiResponseFormatter)({
            message: 'DEMO CREDIT API is Live and Running',
            data: null,
        }));
    }
}
exports.PublicController = PublicController;
