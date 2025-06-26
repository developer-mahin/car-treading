import { ObjectId } from 'mongoose';

export type TProfile = {
  userId: ObjectId;
  first_name?: string;
  last_name?: string;
  phoneNumber?: string;
  profileImage?: string;
  cvrNumber?: string;
  address?: string;
  street: string;
  city?: string;
  zip?: string;
  websiteLink?: string;
  regNo?: string;
  kontoNr?: string;
  companyLogo?: string;
  companyName?: string;
};
