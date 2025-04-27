import { ObjectId } from 'mongoose';

export type TSaleCar = {
  carId: ObjectId;
  dealerId: ObjectId;
  customerDestination: string;
  price: number;
  reRegistrationDeRegistrationView: string;
  signatureAsDealer: string;
  signatureAsOwner: string;
};
