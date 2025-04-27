import { model, Schema } from 'mongoose';
import { TSaleCar } from './saleCar.interface';

const salesCarSchema = new Schema<TSaleCar>(
  {
    carId: { type: Schema.Types.ObjectId, required: true, ref: 'Car' },
    dealerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    price: { type: Number },
    customerDestination: { type: String },
    reRegistrationDeRegistrationView: { type: String },
    signatureAsDealer: { type: String },
    signatureAsOwner: { type: String },
  },
  {
    timestamps: true,
  },
);

const SaleCar = model<TSaleCar>('SaleCar', salesCarSchema);
export default SaleCar;
