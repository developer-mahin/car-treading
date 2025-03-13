import { model, Schema } from 'mongoose';
import { TOTP } from './otp.interface';

const otpSchema = new Schema<TOTP>(
  {
    sendTo: { type: String, required: [true, 'Send to is required'] },
    receiverType: { type: String, enum: ['email', 'phone'], required: true },
    purpose: {
      type: String,
      required: true,
      enum: ['email-verification', 'forget-password'],
      default: 'email-verification',
    },
    otp: { type: String, required: [true, 'OTP is required'], trim: true },
    expiredAt: {
      type: Date,
      required: [true, 'Expired at is required'],
      trim: true,
    },
    verifiedAt: { type: Date, required: false, trim: true },
    status: {
      type: String,
      required: true,
      enum: ['verified', 'pending', 'expired'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const OTP = model<TOTP>('OTP', otpSchema);
export default OTP;
