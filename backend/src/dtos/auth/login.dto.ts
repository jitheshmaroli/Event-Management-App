import { Role } from '@/constants/roles';
import { UserDto } from './user.dto';

export interface LoginInput {
  email: string;
  password: string;
  loginType: Role;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
