import { model, Schema } from 'mongoose';
import { TOfferCar } from './offerCar.interface';

const offerCarSchema = new Schema<TOfferCar>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    dealerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    submitListingCarId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SubmitListingCar',
    },
    carCategory: { type: String, required: true },
    mark: { type: String, required: true },
    model: { type: String, required: true },
    cashPrice: { type: Number, required: true },
    priceType: { type: String, required: true },
    carCondition: { type: String, required: true },
    models: { type: String, required: true },
    fuel: { type: String, required: true },
    gearType: { type: String, required: true },
    modelsYear: { type: Number, required: true },
    carImages: { type: [String], required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accept', 'reject'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const OfferCar = model<TOfferCar>('OfferCar', offerCarSchema);
export default OfferCar;
