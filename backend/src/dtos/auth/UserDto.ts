import { Role } from '@/constants/roles';

export interface UserDto {
  userId: string;
  name: string;
  email: string;
  role: Role;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
