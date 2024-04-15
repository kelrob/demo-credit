import { Application } from 'express';
import { PublicController } from '../controllers/public.controller';
import { signupValidationRules } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { AuthController } from '../controllers/auth.controller';

export class Routes {
  public publicController: PublicController = new PublicController();
  public authController: AuthController = new AuthController();
  public baseUrl: string = '/api/v1/';

  public routes(app: Application): void {
    // Public Controller
    app.get('/', this.publicController.index);
    app.get(this.baseUrl + 'health', this.publicController.healthCheck);

    // Auth
    app.post(this.baseUrl + 'auth/signup', signupValidationRules(), validate, this.authController.signup);
  }
}
