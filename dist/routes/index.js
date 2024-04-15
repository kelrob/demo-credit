"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const public_controller_1 = require("../controllers/public.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_1 = require("../middlewares/validate");
const auth_controller_1 = require("../controllers/auth.controller");
class Routes {
    constructor() {
        this.publicController = new public_controller_1.PublicController();
        this.authController = new auth_controller_1.AuthController();
        this.baseUrl = '/api/v1/';
    }
    routes(app) {
        // Public Controller
        app.get('/', this.publicController.index);
        app.get(this.baseUrl + 'health', this.publicController.healthCheck);
        // Auth
        app.post(this.baseUrl + 'auth/signup', (0, auth_middleware_1.signupValidationRules)(), validate_1.validate, this.authController.signup);
    }
}
exports.Routes = Routes;
