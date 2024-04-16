import { AccountRepository } from '../database/repositories/account.repository';
import { HttpStatus } from '../utils';
import { BadRequestException, ConflictException, errorHandler } from '../exceptions';
import { ChangeAccountBalanceRequestDto } from '../dto/account.dto';
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
}
