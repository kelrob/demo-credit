const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 400,
};

interface ApiResponse {
  data?: any;
  successResponse?: boolean;
  message?: string;
}

const ApiResponseFormatter = (response: ApiResponse) => {
  const { data = null, successResponse = true, message = 'Data Retrieved' } = response;

  return { message, successResponse, data };
};

export { ApiResponseFormatter, HttpStatus };
