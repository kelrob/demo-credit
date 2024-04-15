import { Application } from 'express';
import { PublicController } from '../controllers/public.controller';

export class Routes {
  public publicController: PublicController = new PublicController();
  public baseUrl: string = '/api/v1/';

  public routes(app: Application): void {
    // Public Controller
    app.get('/', this.publicController.index);
    app.get(this.baseUrl + 'health', this.publicController.healthCheck);
  }
}
