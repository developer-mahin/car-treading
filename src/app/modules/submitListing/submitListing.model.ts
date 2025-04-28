import { model, Schema } from 'mongoose';
import { TSubmitListing } from './submitListing.interface';

const submitListingSchema = new Schema<TSubmitListing>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    carCategory: { type: String, required: true },
    mark: { type: String, required: true },
    model: { type: String, required: true },
    cashPrice: { type: Number, required: true },
    priceType: { type: String, required: true },
    carCondition: { type: String, required: true },
    models: { type: String, required: true },
    fuel: { type: String, required: true },
    gearType: { type: String, required: true },
    drivenKmFrom: { type: Number, required: true },
    drivenKmTo: { type: Number, required: true },
    modelsFrom: { type: Number, required: true },
    modelsTo: { type: Number, required: true },
    color: { type: String, required: true },
    trailerHitch: { type: String, required: true },
    exterior: { type: String, required: true },
    interior: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    companyCity: { type: String, required: true },
    companyPostalCode: { type: String, required: true },
    companyName: { type: String, required: true },
    companyPhoneNumber: { type: String, required: true },
    cvrNumber: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const SubmitListing = model<TSubmitListing>(
  'SubmitListing',
  submitListingSchema,
);
export default SubmitListing;
