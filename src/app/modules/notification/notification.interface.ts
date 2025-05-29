import { ObjectId } from 'mongoose';

type TType = 'task' | 'bid';

export const NOTIFICATION_TYPE = {
  task: 'task',
  bid: 'bid',
} as const;

export type TNotification = {
  senderId: ObjectId;
  receiverId: ObjectId;
  linkId: ObjectId; // This can be a string or ObjectId, depending on your use case
  role: string;
  type: TType;
  message: string;
  isRead?: boolean;
};
