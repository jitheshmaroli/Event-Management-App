export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UserProfileResponse {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
}
