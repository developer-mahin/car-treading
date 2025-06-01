import { ObjectId } from 'mongoose';

export type TSaleCar = {
  carId: ObjectId;
  dealerId: ObjectId;
  userId: ObjectId;
  customerDestination: string;
  price: number;
  status: 'sell' | 'sold';
  paymentStatus: 'paid' | 'unpaid';
  reRegistrationDeRegistrationView: string;
  signatureAsDealer: string;
  signatureAsOwner: string;
  isAggrade: boolean;
  isMoms: boolean;
  advancedPayment: number;
  isOrderTransport: boolean;
};
