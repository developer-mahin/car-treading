import { ObjectId } from 'mongoose';

type TType = 'task' | 'bid' | 'offer' | 'car';

export const NOTIFICATION_TYPE = {
  task: 'task',
  bid: 'bid',
  offer: 'offer',
  car: 'car',
} as const;

export type TNotification = {
  senderId: ObjectId;
  receiverId: ObjectId;
  linkId: ObjectId; // This can be a string or ObjectId, depending on your use case
  role: string;
  type: TType;
  message: string;
  isRead?: boolean;
  link: string;
};
