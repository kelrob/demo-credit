import { Request, Response } from 'express';

export class PublicController {
  index(req: Request, res: Response) {
    return res.redirect('/api/v1/health');
  }

  healthCheck(req: Request, res: Response) {
    return res.status(200).json({
      message: 'DEMO CREDIT API is Live and Running',
      data: null,
    });
  }
}
