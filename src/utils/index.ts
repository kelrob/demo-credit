const HttpStatus = {
  OK: 200,
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
