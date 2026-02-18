export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface RegisterResponse {
  userId: string;
}
