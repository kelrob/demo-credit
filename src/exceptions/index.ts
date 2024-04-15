import { HttpStatus } from '../utils';

export class BadRequestException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestException';
  }
}

export class ForbiddenException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenException';
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedException';
  }
}

export function errorHandler(error: Error): {
  status: number;
  response: { message: string; successResponse: boolean; data?: any };
} {
  let status: number;
  let message: string;
  let responseData: any;

  if (error instanceof BadRequestException) {
    status = HttpStatus.BAD_REQUEST;
    message = error.message;
  } else if (error instanceof ForbiddenException) {
    status = HttpStatus.FORBIDDEN;
    message = error.message;
  } else if (error instanceof UnauthorizedException) {
    status = HttpStatus.UNAUTHORIZED;
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
      data: responseData,
    },
  };
}
