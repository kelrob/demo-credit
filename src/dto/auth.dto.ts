export interface SignupRequestDto {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}
