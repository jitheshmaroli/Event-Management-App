import { IUser } from '@/models/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  create(userData: Partial<IUser>): Promise<IUser>;
  updateById(id: string, update: Partial<IUser>): Promise<IUser | null>;
}
