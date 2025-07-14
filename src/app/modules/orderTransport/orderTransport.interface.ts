import { ObjectId } from 'mongoose';

export type TOrderTransport = {
  userId: ObjectId;
  companyName: string;
  address: string;
  zip: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  additional: string;
  cvr: string;
};
