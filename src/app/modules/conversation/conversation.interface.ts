import { ObjectId } from 'mongoose';

export type TConversation = {
  senderId: ObjectId;
  conversationName?: string;
};
