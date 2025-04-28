import { ObjectId } from 'mongoose';

export type TOfferCar = {
  userId: ObjectId;
  dealerId: ObjectId;
  submitListingCarId: ObjectId;
  carCategory: string;
  mark: string;
  model: string;
  cashPrice: number;
  priceType: string;
  carCondition: string;
  models: string;
  fuel: string;
  gearType: string;
  modelsYear: number;
  carImages: string[];
  status: 'accept' | 'reject' | 'pending';
};
