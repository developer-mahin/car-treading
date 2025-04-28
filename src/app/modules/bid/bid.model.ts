import { model, Schema } from 'mongoose';
import { TBid } from './bid.interface';

const bidSchema = new Schema<TBid>(
  {
    carId: { type: Schema.Types.ObjectId, required: true, ref: 'Car' },
    dealerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    bidAmount: { type: Number },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const Bid = model<TBid>('Bid', bidSchema);

export default Bid;
