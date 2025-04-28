import { ObjectId } from 'mongoose';

export type TBid = {
  carId: ObjectId;
  dealerId: ObjectId;
  userId: ObjectId;
  bidAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
};
