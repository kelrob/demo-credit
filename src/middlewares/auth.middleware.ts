import { body } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ApiResponseFormatter, HttpStatus } from '../utils';

dotenv.config();

export const signupValidationRules = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage('email is required')
      .isEmail()
      .withMessage('email must be a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('password is required')
      .isLength({ min: 6 })
      .withMessage('password must be at least 6 characters long'),
  ];
};

export const loginValidationRules = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage('email is required')
      .isEmail()
      .withMessage('email must be a valid email address'),
    body('password').notEmpty().withMessage('password is required'),
  ];
};

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const jwtSecret = process.env.JWT_SECRET;

  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json(
      ApiResponseFormatter({
        message: 'Unauthorized: Token not provided',
        successResponse: false,
      }),
    );
  }
  // Verify the token
  jwt.verify(token, `${jwtSecret}`, (err, user) => {
    if (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ApiResponseFormatter({
          message: 'Unauthorized: Invalid Token',
          successResponse: false,
        }),
      );
    }
    req.user = user;
    next();
  });
};
