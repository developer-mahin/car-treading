import { ObjectId } from 'mongoose';

export type TFeedback = {
  comment: string;
  staffId: ObjectId;
  restaurantId: ObjectId;
  status: 'pending' | 'resolved' | 'rejected';
};
