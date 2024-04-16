import { AccountService } from '../../src/services/account.service';
import { AccountRepository } from '../../src/database/repositories/account.repository';
import { TransactionRepository } from '../../src/database/repositories/transaction.repository';
import { HttpStatus } from '../../src/utils';
import { ChangeAccountBalanceRequestDto, TransferRequestDto } from '../../src/dto/account.dto';

jest.mock('knex', () => {
  return jest.fn().mockReturnValue({
    transaction: jest.fn().mockReturnValue({
      commit: jest.fn(),
      rollback: jest.fn(),
    }),
  });
});

// Mocking the AccountRepository and TransactionRepository
jest.mock('../../src/database/repositories/account.repository');
jest.mock('../../src/database/repositories/transaction.repository');

describe('AccountService', () => {
  let accountService: AccountService;
  let mockAccountRepository: jest.Mocked<AccountRepository>;
  let mockTransactionRepository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    mockAccountRepository = {
      findByUserId: jest.fn(),
      createAccount: jest.fn(),
      fundAccount: jest.fn(),
      debitAccount: jest.fn(),
    } as unknown as jest.Mocked<AccountRepository>;

    mockTransactionRepository = {
      newTransactionHistory: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepository>;

    accountService = new AccountService();
    // Injecting mocked repositories into the account service
    accountService['accountRepository'] = mockAccountRepository;
    accountService['transactionRepository'] = mockTransactionRepository;
  });

  describe('createAccount', () => {
    it('should fail if account already exists', async () => {
      const userId = 123;
      mockAccountRepository.findByUserId.mockResolvedValueOnce({ id: 1, user_id: 123, balance: 500, version: 1 });
      const result = await accountService.createAccount(userId);

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.successResponse).toBe(false);
      expect(result.response.message).toBe('Account already created for this user');
    });

    it('should create a new account for a user who does not have an existing account', async () => {
      mockAccountRepository.findByUserId.mockResolvedValueOnce(null);

      const userId = 123;
      const result = await accountService.createAccount(userId);

      expect(result.status).toBe(HttpStatus.CREATED);
      expect(result.response.successResponse).toBe(true);
    });
  });

  describe('fundAccount', () => {
    it('should fail for a user who does not have an account', async () => {
      const userId = 123;
      const body: ChangeAccountBalanceRequestDto = {
        userId,
        version: 1,
        amount: 100,
      };

      mockAccountRepository.findByUserId.mockResolvedValueOnce(null);
      const result = await accountService.fundAccount(body);

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe('User does not have an account');
      expect(result.response.successResponse).toBe(false);
    });

    it('should fail for after maximum retries', async () => {
      const userId = 123;
      const body: ChangeAccountBalanceRequestDto = {
        userId,
        version: 105,
        amount: 100,
      };

      mockAccountRepository.findByUserId.mockResolvedValue({
        id: 1,
        version: 1,
        user_id: 1,
        balance: 100,
      });
      const result = await accountService.fundAccount(body);

      expect(result.status).toBe(HttpStatus.CONFLICT);
      expect(result.response.message).toBe('Failed to fund account after maximum retries.');
      expect(result.response.successResponse).toBe(false);
      expect(result.response.data?.versionToUse).toBe(1);
    });

    it('should fund the account successfully', async () => {
      const userId = 1;
      const body: ChangeAccountBalanceRequestDto = {
        userId,
        version: 1,
        amount: 100,
      };

      mockAccountRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        version: 1,
        user_id: 1,
        balance: 100,
      });

      mockAccountRepository.fundAccount.mockResolvedValueOnce(1);

      const result = await accountService.fundAccount(body);

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.message).toBe('Account funded successfully');
      expect(mockTransactionRepository.newTransactionHistory).toHaveBeenCalled();
      expect(result.response.successResponse).toBe(true);
    });
  });

  describe('transferFundsToUser', () => {
    const body: TransferRequestDto = {
      senderId: 1,
      amount: 100,
      receiverId: 4,
      senderVersion: 5,
      receiverVersion: 1,
    };

    it('should fail if sender or receiver account is not found', async () => {
      mockAccountRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        version: 1,
        user_id: 1,
        balance: 100,
      });

      mockAccountRepository.findByUserId.mockResolvedValueOnce(null);
      const result = await accountService.transferFundsToUser(body);

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe('Sender or Receiver Account not found');
      expect(result.response.successResponse).toBe(false);
    });

    it('should fail if sender is also the receiver', async () => {
      mockAccountRepository.findByUserId.mockResolvedValueOnce({ id: 1, version: 1, balance: 0, user_id: 1 });
      mockAccountRepository.findByUserId.mockResolvedValueOnce({ id: 1, version: 1, balance: 0, user_id: 1 });

      const result = await accountService.transferFundsToUser(body);

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe('You can not transfer funds to yourself');
      expect(result.response.successResponse).toBe(false);
    });

    it('should fail if sender has insufficient balance', async () => {
      mockAccountRepository.findByUserId.mockResolvedValueOnce({ id: 1, version: 1, balance: 0, user_id: 1 });
      mockAccountRepository.findByUserId.mockResolvedValueOnce({ id: 1, version: 1, balance: 0, user_id: 4 });

      const result = await accountService.transferFundsToUser(body);

      expect(result.status).toBe(HttpStatus.PAYMENT_REQUIRED);
      expect(result.response.message).toBe('Insufficient Balance');
      expect(result.response.successResponse).toBe(false);
    });

    it('should fail after maximum retries', async () => {
      mockAccountRepository.findByUserId.mockImplementation(async (userId, trx) => {
        if (userId === 1) {
          return { id: 1, version: 1000, balance: 200000, user_id: 1 };
        } else if (userId === 4) {
          return { id: 2, version: 2000, balance: 100000, user_id: 4 };
        }
      });
      const result = await accountService.transferFundsToUser(body);

      expect(result.status).toBe(HttpStatus.CONFLICT);
      expect(result.response.message).toBe('Failed to fund account after maximum retries.');
      expect(result.response.successResponse).toBe(false);
      expect(result.response.data?.senderVersion).toBeGreaterThanOrEqual(0);
      expect(result.response.data?.receiverVersion).toBeGreaterThanOrEqual(0);
    });

    it('should transfer to receiver account successfully', async () => {
      const userId = 1;

      mockAccountRepository.findByUserId.mockResolvedValueOnce({ id: 1, version: 5, balance: 100000, user_id: 1 });
      mockAccountRepository.findByUserId.mockResolvedValueOnce({ id: 1, version: 1, balance: 100000, user_id: 4 });
      mockAccountRepository.findByUserId.mockResolvedValueOnce({ id: 1, version: 5, balance: 100000, user_id: 1 });
      mockAccountRepository.findByUserId.mockResolvedValueOnce({ id: 1, version: 1, balance: 100000, user_id: 4 });

      const result = await accountService.transferFundsToUser(body);

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.successResponse).toBe(true);
      expect(mockAccountRepository.debitAccount).toHaveBeenCalled();
      expect(mockAccountRepository.fundAccount).toHaveBeenCalled();
      expect(mockTransactionRepository.newTransactionHistory).toHaveBeenCalled();
      expect(result.response.message).toBe('Transfer completed successfully');
    });
  });

  describe('withdrawFundsFromAccount', () => {
    const userId = 1;
    const amount = 100;
    const version = 1;

    it('should fail if user account is not found', async () => {
      mockAccountRepository.findByUserId.mockResolvedValueOnce(null);

      const result = await accountService.withdrawFundsFromAccount(userId, amount, version);

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'User Account not found. Confirm if this user has already created an account',
      );
      expect(result.response.successResponse).toBe(false);
    });

    it('should fail if user has insufficient balance to withdraw from', async () => {
      mockAccountRepository.findByUserId.mockResolvedValueOnce({ id: 1, version: 1, balance: 0, user_id: 1 });

      const result = await accountService.withdrawFundsFromAccount(userId, amount, version);

      expect(result.status).toBe(HttpStatus.PAYMENT_REQUIRED);
      expect(result.response.message).toBe('Insufficient Balance');
      expect(result.response.successResponse).toBe(false);
    });

    it('should fail if there is a version mismatch - OCC', async () => {
      const versionToUse = 10;
      mockAccountRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        version: versionToUse,
        balance: 10000,
        user_id: 1,
      });

      const result = await accountService.withdrawFundsFromAccount(userId, amount, version);

      expect(result.status).toBe(HttpStatus.CONFLICT);
      expect(result.response.message).toBe('Version mismatch');
      expect(result.response.successResponse).toBe(false);
      expect(result.response.data?.versionToUse).toBe(versionToUse);
    });

    it('withdraw from account successfully', async () => {
      mockAccountRepository.findByUserId.mockResolvedValueOnce({ id: 1, version: 1, balance: 10000, user_id: 1 });

      const result = await accountService.withdrawFundsFromAccount(userId, amount, version);

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.successResponse).toBe(true);
      expect(mockAccountRepository.debitAccount).toHaveBeenCalled();
      expect(mockTransactionRepository.newTransactionHistory).toHaveBeenCalled();
      expect(result.response.message).toBe('Withdrawal Processed successfully');
    });
  });
});
