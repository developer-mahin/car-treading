import { model, Schema } from 'mongoose';
import { TOrderTransport } from './orderTransport.interface';

const orderTransportSchema = new Schema<TOrderTransport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    additional: { type: String, required: true },
    cvr: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

const OrderTransport = model('OrderTransport', orderTransportSchema);
export default OrderTransport;
