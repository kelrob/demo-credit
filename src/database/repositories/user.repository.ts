import knex from '../database';
import { SignupRequestDto } from '../../dto/auth.dto';

const table = 'users';

export class UserRepository {
  async findByEmail(email: string) {
    return knex(table).where({ email }).first();
  }

  async createUser(body: SignupRequestDto) {
    return knex(table).insert(body);
  }
}
