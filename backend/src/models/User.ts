import { Schema, model, Document } from 'mongoose';
import { ROLES, Role } from '@/constants/roles';
import { OtpPurpose } from '@/constants/otpPurpose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  isVerified: boolean;
  otp?: string;
  otpCreatedAt?: Date;
  otpPurpose?: OtpPurpose;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpCreatedAt: { type: Date, select: false },
    otpPurpose: { type: String, select: false },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
