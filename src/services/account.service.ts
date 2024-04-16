import { AccountRepository } from '../database/repositories/account.repository';
import { HttpStatus } from '../utils';
import { BadRequestException, ConflictException, errorHandler, PaymentRequiredException } from '../exceptions';
import { AccountResponseDto, ChangeAccountBalanceRequestDto, TransferRequestDto } from '../dto/account.dto';
import knex from '../database/database';
import { TransactionRepository } from '../database/repositories/transaction.repository';
import { TransactionType } from '../dto/transaction.dto';

export class AccountService {
  private accountRepository: AccountRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async createAccount(userId: number) {
    try {
      // Check if user already has an account
      const accountExists = await this.accountRepository.findByUserId(userId);
      if (accountExists) {
        throw new BadRequestException(`Account already created for this user`);
      }
      // Create account
      await this.accountRepository.createAccount(userId);

      return {
        status: HttpStatus.CREATED,
        response: {
          message: 'Account Created Successfully',
          successResponse: true,
        },
      };
    } catch (error: any) {
      return errorHandler(error);
    }
  }

  async fundAccount(body: ChangeAccountBalanceRequestDto) {
    const MAX_RETRIES = 5;
    const { userId } = body;
    const amount = body.amount * 100;
    let version = body.version;

    try {
      let retries = 0;
      let versionToUse;
      while (retries < MAX_RETRIES) {
        let trx;
        try {
          // Start transaction
          trx = await knex.transaction();

          // Get current user account within transaction
          const currentUserAccount = await this.accountRepository.findByUserId(userId, trx);
          if (!currentUserAccount) {
            throw new BadRequestException('User does not have an account');
          }
          versionToUse = currentUserAccount.version;
          // Check for optimistic concurrency control
          if (versionToUse !== version) {
            throw new ConflictException('Conflict: Account version mismatch');
          }

          // Fund user account within the transaction
          await this.accountRepository.fundAccount(
            {
              amount,
              id: currentUserAccount.id,
              userId,
              version,
            },
            trx,
          );

          // Store in transaction history
          await this.transactionRepository.newTransactionHistory(
            {
              amount,
              type: TransactionType.DEPOSIT,
              toAccountId: currentUserAccount.id,
            },
            trx,
          );

          // Commit transaction
          await trx.commit();

          return {
            status: HttpStatus.OK,
            response: {
              message: 'Account funded successfully',
              successResponse: true,
            },
          };
        } catch (error: any) {
          if (trx) {
            await trx.rollback();
          }

          // Increment version for next retry
          if (error instanceof ConflictException) {
            version++;
            retries++;
          } else {
            retries = MAX_RETRIES;

            return errorHandler(error);
          }
        }
      }

      throw new ConflictException('Failed to fund account after maximum retries.', { versionToUse });
    } catch (error: any) {
      return errorHandler(error);
    }
  }

  async transferFundsToUser(body: TransferRequestDto) {
    const MAX_RETRIES = 5;
    const { senderId, receiverId, amount, senderVersion, receiverVersion } = body;
    const transferAmount = amount * 100;
    let currentSenderVersion = senderVersion;
    let currentReceiverVersion = receiverVersion;

    try {
      let retries = 0;
      let success = false;
      let senderAccount: AccountResponseDto;
      let receiverAccount: AccountResponseDto;
      let trx;

      while (!success && retries < MAX_RETRIES) {
        try {
          trx = await knex.transaction();
          senderAccount = await this.accountRepository.findByUserId(senderId, trx);
          receiverAccount = await this.accountRepository.findByUserId(receiverId, trx);

          if (!senderAccount || !receiverAccount) {
            throw new BadRequestException('Sender or Receiver Account not found');
          }

          if (senderAccount.user_id === receiverAccount.user_id) {
            throw new BadRequestException('You can not transfer funds to yourself');
          }

          if (senderAccount.balance < transferAmount) {
            throw new PaymentRequiredException('Insufficient Balance');
          }

          if (senderAccount.version !== currentSenderVersion) {
            throw new ConflictException('Conflict: Sender account version mismatch');
          }

          if (receiverAccount.version !== currentReceiverVersion) {
            throw new ConflictException('Conflict: Receiver account version mismatch');
          }

          await this.accountRepository.debitAccount(
            {
              amount: transferAmount,
              id: senderAccount.id,
              userId: senderId,
              version: senderVersion,
            },
            trx,
          );
          await this.accountRepository.fundAccount(
            {
              amount: transferAmount,
              id: receiverAccount.id,
              userId: receiverId,
              version: receiverVersion,
            },
            trx,
          );

          await this.transactionRepository.newTransactionHistory(
            {
              amount: transferAmount,
              type: TransactionType.TRANSFER,
              fromAccountId: senderAccount.id,
              toAccountId: receiverAccount.id,
            },
            trx,
          );

          await trx.commit();
          success = true;
        } catch (error: any) {
          if (trx) {
            await trx.rollback();
          }

          if (error instanceof ConflictException) {
            retries++;
            if (error.message === 'Conflict: Sender account version mismatch') {
              currentSenderVersion++;
            } else if (error.message === 'Conflict: Receiver account version mismatch') {
              currentReceiverVersion++;
            }
          } else {
            retries = MAX_RETRIES;

            return errorHandler(error);
          }
        }
      }

      if (success) {
        return {
          status: HttpStatus.OK,
          response: {
            message: 'Transfer completed successfully',
            successResponse: true,
          },
        };
      } else {
        const latestSenderAccount: AccountResponseDto = await this.accountRepository.findByUserId(senderId);
        const latestReceiverAccount: AccountResponseDto = await this.accountRepository.findByUserId(receiverId);

        throw new ConflictException('Failed to fund account after maximum retries.', {
          senderVersion: latestSenderAccount.version,
          receiverVersion: latestReceiverAccount.version,
        });
      }
    } catch (error: any) {
      return errorHandler(error);
    }
  }

  async withdrawFundsFromAccount(userId: number, amount: number, version: number) {
    const amountToWithdraw = amount * 100;

    const trx = await knex.transaction();

    try {
      const userAccount: AccountResponseDto = await this.accountRepository.findByUserId(userId, trx);
      if (!userAccount) {
        throw new BadRequestException('User Account not found. Confirm if this user has already created an account');
      }

      // Check if sender has sufficient balance
      if (userAccount.balance < amountToWithdraw) {
        throw new PaymentRequiredException('Insufficient Balance');
      }

      // Check account version for consistency
      if (userAccount.version !== version) {
        throw new ConflictException('Version mismatch', { versionToUse: userAccount.version });
      }

      await this.accountRepository.debitAccount(
        {
          amount: amountToWithdraw,
          userId,
          version,
          id: userAccount.id,
        },
        trx,
      );

      // Store transaction history for
      await this.transactionRepository.newTransactionHistory(
        {
          amount: amountToWithdraw,
          type: TransactionType.WITHDRAWAL,
          fromAccountId: userAccount.id,
        },
        trx,
      );

      await trx.commit();

      return {
        status: HttpStatus.OK,
        response: {
          message: 'Withdrawal Processed successfully',
          successResponse: true,
        },
      };
    } catch (error: any) {
      if (trx) {
        await trx.rollback();
      }

      return errorHandler(error);
    }
  }
}
