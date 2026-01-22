import { UserDto } from './UserDto';

export interface LoginInput {
  email: string;
  password: string;
  loginType: 'user' | 'admin';
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
