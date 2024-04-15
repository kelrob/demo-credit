"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicController = void 0;
class PublicController {
    index(req, res) {
        return res.redirect('/api/v1/health');
    }
    healthCheck(req, res) {
        return res.status(200).json({
            message: 'DEMO CREDIT API is Live and Running',
            data: null,
        });
    }
}
exports.PublicController = PublicController;
