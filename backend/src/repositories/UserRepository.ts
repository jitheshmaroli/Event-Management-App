import { injectable } from 'inversify';
import { User, IUser } from '../models/User';
import { IUserRepository } from '../interfaces/repositories/IUserRepository';
import { BaseRepository } from './BaseRepository';

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(User);
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return this.model
      .findOne({ email })
      .select('+password +refreshToken +otp +otpCreatedAt +otpPurpose');
  }
}
