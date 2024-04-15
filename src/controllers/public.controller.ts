import { Request, Response } from 'express';
import { ApiResponseFormatter, HttpStatus } from '../utils';

export class PublicController {
  index(req: Request, res: Response) {
    return res.redirect('/api/v1/health');
  }

  healthCheck(req: Request, res: Response) {
    res.status(HttpStatus.OK).json(
      ApiResponseFormatter({
        message: 'DEMO CREDIT API is Live and Running',
        data: null,
      }),
    );
  }
}
