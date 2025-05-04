import { ObjectId } from 'mongoose';

export type TMessage = {
  conversationId: ObjectId;
  message?: string;
  image?: string;
  senderId: ObjectId;
};
