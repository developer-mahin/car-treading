import { ObjectId } from 'mongoose';

export type TConversation = {
  users: ObjectId[];
  conversationName?: string;
};
