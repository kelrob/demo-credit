import express, { Application } from 'express';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
}

const app = new App().app;
export default app;
