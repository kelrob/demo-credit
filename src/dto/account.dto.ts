export interface ChangeAccountBalanceRequestDto {
  userId: number;
  amount: number;
  version: number;
  id?: number;
}
