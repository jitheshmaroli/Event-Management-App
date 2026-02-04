import { Schema, model } from 'mongoose';

export interface IService {
  title: string;
  category: string;
  description: string;
  pricePerDay: number;
  location: string;
  contactDetails: {
    phone: string;
    email?: string;
    whatsapp?: string;
  };
  images: string[];
  availability: {
    defaultAvailable: boolean;
    blockedRanges: {
      from: Date;
      to: Date;
      reason?: string;
    }[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, required: true, lowercase: true },
    description: { type: String, required: true, maxlength: 3000 },
    pricePerDay: { type: Number, required: true, min: 100 },
    location: { type: String, required: true, trim: true },
    contactDetails: {
      phone: { type: String, required: true },
      email: String,
      whatsapp: String,
    },
    images: [{ type: String }],
    availability: {
      defaultAvailable: { type: Boolean, default: true },
      blockedRanges: [
        {
          from: { type: Date, required: true },
          to: { type: Date, required: true },
          reason: { type: String, trim: true, maxlength: 200 },
        },
      ],
    },
  },
  { timestamps: true }
);

serviceSchema.index({
  title: 'text',
  description: 'text',
  category: 1,
  location: 1,
});

export const Service = model<IService>('Service', serviceSchema);
