"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const public_controller_1 = require("../controllers/public.controller");
class Routes {
    constructor() {
        this.publicController = new public_controller_1.PublicController();
        this.baseUrl = '/api/v1/';
    }
    routes(app) {
        // Public Controller
        app.get('/', this.publicController.index);
        app.get(this.baseUrl + 'health', this.publicController.healthCheck);
    }
}
exports.Routes = Routes;
