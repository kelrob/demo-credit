import { HttpStatus } from '../utils';

export class HttpException extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string, data?: any) {
    super(message, HttpStatus.CONFLICT, data);
  }
}

export class PaymentRequiredException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.PAYMENT_REQUIRED);
  }
}

export function errorHandler(error: Error): {
  status: number;
  response: { message: string; successResponse: boolean; data?: any };
} {
  let status: number;
  let message: string;

  if (error instanceof HttpException) {
    status = error.status;
    message = error.message;
  } else {
    status = HttpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  return {
    status,
    response: {
      message,
      successResponse: false,
      data: error instanceof ConflictException ? error.data : undefined,
    },
  };
}
