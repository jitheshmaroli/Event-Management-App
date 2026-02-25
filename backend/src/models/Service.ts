import { ServiceCategory } from '@/constants/service.constants';
import { Schema, Types, model } from 'mongoose';

export interface IService {
  title: string;
  category: ServiceCategory;
  description: string;
  pricePerDay: number;
  location: string;
  phone: string;
  images: string[];
  availability: {
    availableRanges: {
      from: Date;
      to: Date;
    }[];
    bookedRanges: {
      from: Date;
      to: Date;
      reason?: string;
    }[];
    reservedRanges?: { from: Date; to: Date; bookingId: Types.ObjectId }[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const rangeSchema = new Schema({
  from: { type: Date, required: true },
  to: { type: Date, required: true },
});

const reservedRangeSchema = new Schema({
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
});

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, required: true, lowercase: true },
    description: { type: String, required: true, maxlength: 3000 },
    pricePerDay: { type: Number, required: true, min: 100 },
    location: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    images: [{ type: String }],
    availability: {
      availableRanges: [rangeSchema],
      bookedRanges: [rangeSchema],
      reservedRanges: [reservedRangeSchema],
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
