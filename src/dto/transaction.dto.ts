export interface TransactionRequestDto {
  fromAccountId?: number;
  toAccountId?: number;
  amount: number;
  type: TransactionType;
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}
