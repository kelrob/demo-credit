import { LoginRequestDto, SignupRequestDto } from '../dto/auth.dto';
import { HttpStatus } from '../utils';
import bcrypt from 'bcrypt';
import { UserRepository } from '../database/repositories/user.repository';
import dotenv from 'dotenv';
import axios from 'axios';
import { BadRequestException, errorHandler, ForbiddenException, UnauthorizedException } from '../exceptions';
import jwt from 'jsonwebtoken';

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
      console.log({ error });

      return errorHandler(error);
    }
  }

  async login(body: LoginRequestDto) {
    try {
      const jwtSecret = process.env.JWT_SECRET;
      const jwtExpiry = process.env.JWT_EXPIRY;

      const { email, password } = body;
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      // Compare hashed password with provided password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      // Generate JWT token
      const token = jwt.sign({ email: user.email, id: user.id }, `${jwtSecret}`, { expiresIn: jwtExpiry });

      return {
        status: HttpStatus.OK,
        response: {
          message: 'Login Successfully',
          successResponse: true,
          data: { token },
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
