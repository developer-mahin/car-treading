import { model, Schema } from 'mongoose';
import { TMessage } from './message.interface';

const messageSchema = new Schema<TMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Conversation id is required'],
      ref: 'Conversation',
    },
    query: { type: String, required: [true, 'Query is required'], trim: true },
    response: {
      type: String,
      required: [true, 'Response is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Message = model<TMessage>('Message', messageSchema);

export default Message;
