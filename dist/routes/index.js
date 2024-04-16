"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const public_controller_1 = require("../controllers/public.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_1 = require("../middlewares/validate");
const auth_controller_1 = require("../controllers/auth.controller");
const account_controller_1 = require("../controllers/account.controller");
const account_middleware_1 = require("../middlewares/account.middleware");
class Routes {
    constructor() {
        this.publicController = new public_controller_1.PublicController();
        this.authController = new auth_controller_1.AuthController();
        this.accountController = new account_controller_1.AccountController();
        this.baseUrl = '/api/v1/';
    }
    routes(app) {
        // Public Controller
        app.get('/', this.publicController.index);
        app.get(this.baseUrl + 'health', this.publicController.healthCheck);
        // Auth
        app.post(this.baseUrl + 'auth/signup', (0, auth_middleware_1.signupValidationRules)(), validate_1.validate, this.authController.signup);
        app.post(this.baseUrl + 'auth/login', (0, auth_middleware_1.loginValidationRules)(), validate_1.validate, this.authController.login);
        // Account
        app.post(this.baseUrl + 'account', auth_middleware_1.validateToken, this.accountController.createAccount);
        app.post(this.baseUrl + 'account/fund', [auth_middleware_1.validateToken, ...(0, account_middleware_1.fundAccountValidationRules)()], validate_1.validate, this.accountController.fundAccount);
    }
}
exports.Routes = Routes;
