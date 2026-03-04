import { UpdateProfileInput, UserProfileResponse } from '@/dtos/user/user.dto';

export interface IUserService {
  updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<UserProfileResponse>;
}
