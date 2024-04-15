import { Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { HttpStatus } from '../utils';

export const validate = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors: any[] = [];
  errors.array().forEach((err: ValidationError) => {
    const param = err.msg.split(' ')[0];
    extractedErrors.push({ [param]: err.msg });
  });

  return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
    errors: extractedErrors,
  });
};
