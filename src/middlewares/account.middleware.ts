import { body } from 'express-validator';

export const fundAccountValidationRules = () => {
  return [
    body('amount')
      .notEmpty()
      .withMessage('amount is required')
      .isInt({ min: 100 })
      .withMessage('amount can only be number greater than or equal to 100'),
    body('version').notEmpty().withMessage('version is required').isInt().withMessage('version can only be number'),
  ];
};
