import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponseFormatter } from '../utils';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public signup = async (req: Request, res: Response) => {
    const { status, response } = await this.authService.signup(req.body);

    return res.status(status).json(ApiResponseFormatter(response));
  };
}
