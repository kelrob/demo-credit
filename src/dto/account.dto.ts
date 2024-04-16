export interface ChangeAccountBalanceRequestDto {
  userId: number;
  amount: number;
  version: number;
  id?: number;
}

export interface TransferRequestDto {
  senderId: number;
  receiverId: number;
  amount: number;
  senderVersion: number;
  receiverVersion: number;
}

export interface AccountResponseDto {
  id: number;
  user_id: number;
  balance: number;
  version: number;
}
