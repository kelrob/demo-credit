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

  public fundAccount = async (req: Request, res: Response) => {
    const body = { userId: req.user.id, ...req.body };
    const { status, response } = await this.accountService.fundAccount(body);

    return res.status(status).json(ApiResponseFormatter(response));
  };

  public transferFundsToUser = async (req: Request, res: Response) => {
    const body = { senderId: req.user.id, ...req.body };
    const { status, response } = await this.accountService.transferFundsToUser(body);

    return res.status(status).json(ApiResponseFormatter(response));
  };

  public withdrawFundsFromAccount = async (req: Request, res: Response) => {
    const { status, response } = await this.accountService.withdrawFundsFromAccount(
      req.user.id,
      req.body.amount,
      req.body.version,
    );

    return res.status(status).json(ApiResponseFormatter(response));
  };
}
