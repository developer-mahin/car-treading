import { ObjectId } from 'mongoose';

export type TSaleCar = {
  carId: ObjectId;
  dealerId: ObjectId;
  customerDestination: string;
  price: number;
  status: 'sell' | 'sold';
  reRegistrationDeRegistrationView: string;
  signatureAsDealer: string;
  signatureAsOwner: string;
};
