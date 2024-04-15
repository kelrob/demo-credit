import knex from '../database';
import { SignupRequestDto } from '../../dto/auth.dto';

export class UserRepository {
  async findByEmail(email: string) {
    return knex('users').where({ email }).first();
  }

  async createUser(body: SignupRequestDto) {
    return knex('users').insert(body);
  }
}
