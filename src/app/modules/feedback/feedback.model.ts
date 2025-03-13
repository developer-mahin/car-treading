import { model, Schema } from 'mongoose';
import { TFeedback } from './feedback.interface';

const feedbackSchema = new Schema<TFeedback>(
  {
    staffId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    restaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    comment: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'resolved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const Feedback = model<TFeedback>('Feedback', feedbackSchema);
export default Feedback;
