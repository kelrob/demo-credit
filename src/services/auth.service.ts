import { SignupRequestDto } from '../dto/auth.dto';
import { HttpStatus } from '../utils';
import bcrypt from 'bcrypt';
import { UserRepository } from '../database/repositories/user.repository';
import dotenv from 'dotenv';
import axios from 'axios';
import { BadRequestException, errorHandler, ForbiddenException } from '../exceptions';

dotenv.config();

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async signup(body: SignupRequestDto) {
    const { email, password } = body;
    try {
      const existingUser = await this.userRepository.findByEmail(email);

      // Check if user in Karma Blacklist
      const userBlacklisted = await this.checkIfUserBlacklisted(email);
      if (userBlacklisted) {
        throw new ForbiddenException('Forbidden Resource');
      }

      if (existingUser) {
        throw new BadRequestException('User with Email already exists');
      }

      // Hash the password
      body.password = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      await this.userRepository.createUser(body);

      return {
        status: HttpStatus.CREATED,
        response: {
          message: 'User Created Successfully',
          successResponse: true,
          data: { email },
        },
      };
    } catch (error: any) {
      return errorHandler(error);
    }
  }

  private async checkIfUserBlacklisted(email: string) {
    const adjutorBaseUrl = process.env.ADJUTOR_BASE_URL;
    const adjutorApiKey = process.env.ADJUTOR_API_KEY;

    try {
      await axios.get(`${adjutorBaseUrl}verification/karma/${email}`, {
        headers: {
          Authorization: `Bearer ${adjutorApiKey}`,
        },
      });

      return true;
    } catch (error: any) {
      return error.response.status !== 404;
    }
  }
}
