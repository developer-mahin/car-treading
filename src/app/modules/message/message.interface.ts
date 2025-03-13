import { ObjectId } from 'mongoose';

export type TMessage = {
  conversationId: ObjectId;
  query: string;
  response: string;
};
