import { model, Schema } from 'mongoose';
import { TSubmitListing } from './submitListing.interface';

const submitListingSchema = new Schema<TSubmitListing>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    carCategory: { type: String, required: true },
    mark: { type: String, required: true },
    model: { type: String, required: true },
    cashPrice: { type: Number, required: true },
    priceType: { type: [String], required: true },
    carCondition: { type: String, required: true },
    models: { type: String, required: true },
    fuel: { type: [String], required: true },
    gearType: { type: [String], required: true },
    drivenKmFrom: { type: Number, required: true },
    drivenKmTo: { type: Number, required: true },
    modelsFrom: { type: Number, required: true },
    modelsTo: { type: Number, required: true },
    color: { type: [String] },
    trailerHitch: { type: String },
    exterior: { type: [String] },
    interior: { type: [String] },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    city: { type: String },
    street: { type: String },
    postalCode: { type: String },
    companyCity: { type: String },
    companyPostalCode: { type: String },
    companyName: { type: String },
    companyPhoneNumber: { type: String },
    cvrNumber: { type: String },
    isOffer: { type: Boolean, default: false },
    brandImage: { type: String },
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
