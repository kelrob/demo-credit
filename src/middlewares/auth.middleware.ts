import { body } from 'express-validator';
import dotenv from 'dotenv';

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
