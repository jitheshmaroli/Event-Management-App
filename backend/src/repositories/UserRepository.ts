import { injectable } from 'inversify';
import { User, IUser } from '../models/User';
import { IUserRepository } from '../interfaces/repositories/IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select(
      '+password +refreshToken +otp +otpCreatedAt'
    );
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async updateById(id: string, update: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, update, { new: true });
  }
}
