import { inject, injectable } from 'inversify';
import { TYPES } from '@/inversify/types';
import { IUserService } from '@/interfaces/services/IUserService';
import { IUserRepository } from '@/interfaces/repositories/IUserRepository';
import { UpdateProfileInput, UserProfileResponse } from '@/dtos/user/user.dto';
import { UnauthorizedError } from '@/utils/errors';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}

  async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<UserProfileResponse> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');

    const update: UpdateProfileInput = {};

    if (data.name) update.name = data.name.trim();
    if (data.phone) update.phone = data.phone.trim();

    const updated = await this._userRepo.updateById(userId, update);
    if (!updated) throw new Error('Failed to update profile');

    return {
      userId: updated._id.toString(),
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      isVerified: updated.isVerified,
      createdAt: updated.createdAt,
    };
  }
}
