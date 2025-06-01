import { model, Schema } from 'mongoose';
import { TSaleCar } from './saleCar.interface';

const salesCarSchema = new Schema<TSaleCar>(
  {
    carId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Car',
      unique: true,
    },
    dealerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    price: { type: Number },
    customerDestination: { type: String },
    reRegistrationDeRegistrationView: { type: String },
    signatureAsDealer: { type: String },
    signatureAsOwner: { type: String },
    advancedPayment: { type: Number },
    isAggrade: { type: Boolean, default: false },
    isMoms: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      required: [true, 'Payment status is required'],
      enum: ['paid', 'unpaid'],
      default: 'unpaid',
    },
    isOrderTransport: { type: Boolean, default: false },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['sold', 'sell'],
      default: 'sell',
    },
  },
  {
    timestamps: true,
  },
);

const SaleCar = model<TSaleCar>('SaleCar', salesCarSchema);
export default SaleCar;
