import { Schema, model, Document, Types } from 'mongoose';

export enum BookingStatus {
  RESERVED = 'reserved',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export interface IBooking extends Document {
  user: Types.ObjectId;
  service: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  totalAmount: number;
  status: BookingStatus;
  reservedUntil?: Date;
  expiresAt?: Date;
  payment: {
    provider: string;
    referenceId: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    refundReferenceId?: string;
    refundStatus?: PaymentStatus;
  };
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfDays: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    reservedUntil: { type: Date },
    expiresAt: { type: Date },
    payment: {
      provider: { type: String, required: true },
      referenceId: { type: String, required: true },
      status: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
      },
      amount: { type: Number, required: true },
      currency: { type: String, default: 'INR' },
      refundReferenceId: String,
      refundStatus: String,
    },
  },
  { timestamps: true }
);

// Compound index to prevent overlapping bookings
bookingSchema.index(
  { service: 1, startDate: 1, endDate: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    },
  }
);

bookingSchema.index({ user: 1, createdAt: -1 });

export const Booking = model<IBooking>('Booking', bookingSchema);
