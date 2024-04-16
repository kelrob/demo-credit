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

export const transferFundsToAccountValidationRules = () => {
  return [
    body('amount')
      .notEmpty()
      .withMessage('amount is required')
      .isInt({ min: 100 })
      .withMessage('amount can only be number greater than or equal to 100'),
    body('receiverId')
      .notEmpty()
      .withMessage('receiverId is required')
      .isInt({ min: 1 })
      .withMessage('receiverId can only be number and greater than 0'),
    body('senderVersion')
      .notEmpty()
      .withMessage('senderVersion is required')
      .isInt()
      .withMessage('senderVersion can only be number'),
    body('receiverVersion')
      .notEmpty()
      .withMessage('receiverVersion is required')
      .isInt()
      .withMessage('receiverVersion can only be number'),
  ];
};

export const withdrawFromAccountValidationRules = () => {
  return [
    body('amount')
      .notEmpty()
      .withMessage('amount is required')
      .isInt({ min: 100 })
      .withMessage('amount can only be number greater than or equal to 100'),
    body('version').notEmpty().withMessage('version is required').isInt().withMessage('version can only be number'),
  ];
};
