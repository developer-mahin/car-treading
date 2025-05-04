import { model, Schema } from 'mongoose';
import { TMessage } from './message.interface';

const messageSchema = new Schema<TMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Conversation id is required'],
      ref: 'Conversation',
    },
    image: { type: String },
    message: { type: String },
    senderId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Sender id is required'],
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

const Message = model<TMessage>('Message', messageSchema);

export default Message;
