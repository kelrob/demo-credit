import { Request, Response } from 'express';
import { ApiResponseFormatter } from '../utils';
import { AccountService } from '../services/account.service';

export class AccountController {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  public createAccount = async (req: Request, res: Response) => {
    const { status, response } = await this.accountService.createAccount(req.user.id);

    return res.status(status).json(ApiResponseFormatter(response));
  };
}
