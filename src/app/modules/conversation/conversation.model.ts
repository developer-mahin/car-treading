import { model, Schema } from 'mongoose';
import { TConversation } from './conversation.interface';

const conversationSchema = new Schema<TConversation>(
  {
    conversationName: {
      type: String,
      trim: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Conversation = model<TConversation>('Conversation', conversationSchema);

export default Conversation;
