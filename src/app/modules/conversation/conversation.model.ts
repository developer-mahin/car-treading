import { model, Schema } from 'mongoose';
import { TConversation } from './conversation.interface';

const conversationSchema = new Schema<TConversation>(
  {
    conversationName: {
      type: String,
      trim: true,
      default: null,
    },
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

const Conversation = model<TConversation>('Conversation', conversationSchema);

export default Conversation;
