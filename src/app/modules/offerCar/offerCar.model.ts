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
    priceType: { type: [String], required: true },
    carCondition: { type: String, required: true },
    models: { type: String, required: true },
    fuel: { type: [String], required: true },
    gearType: { type: [String], required: true },
    modelsYear: { type: Number, required: true },
    carImages: { type: [String], required: true },
    carLicensePlateNumber: { type: String },
    color: { type: String },
    DrivenKm: { type: Number },
    reRegistrationDeRegistrationView: { type: String },
    signatureAsDealer: { type: String },
    signatureAsOwner: { type: String },
    isAggrade: { type: Boolean, default: false },
    isMoms: { type: Boolean, default: false },
    advancedPayment: { type: Number, default: 0 },
    isOrderTransport: { type: Boolean, default: false },
    brandImage: { type: String },
    chassisNumber: { type: String },
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
