import { AccountRepository } from '../database/repositories/account.repository';
import { HttpStatus } from '../utils';
import { BadRequestException, errorHandler } from '../exceptions';

export class AccountService {
  private accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
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
}
