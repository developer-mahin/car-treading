import { ObjectId } from 'mongoose';

export type TType = 'privacy-policy' | 'terms-and-conditions';

export type TStaticContent = {
  userId: ObjectId;
  type: TType;
  content?: string;
};
