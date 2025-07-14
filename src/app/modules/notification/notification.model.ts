import { model, Schema } from 'mongoose';
import { TNotification } from './notification.interface';

const notificationSchema = new Schema<TNotification>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender id is required'],
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver id is required'],
    },
    linkId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Link id is required'],
    },
    role: { type: String, required: true },
    type: {
      type: String,
      enum: ['task', 'bid', 'offer', 'car'],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  {
    timestamps: true,
  },
);

const Notification = model<TNotification>('Notification', notificationSchema);
export default Notification;
