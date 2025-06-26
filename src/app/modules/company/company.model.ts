import mongoose, { Schema } from 'mongoose';
import { TCompany } from './company.interface';

// Define the schema based on TCompany interface
const CompanySchema = new Schema<TCompany>(
  {
    companyName: {
      type: String,
    },
    cvrNumber: {
      type: String,
    },
    postCode: {
      type: String,
    },
    city: {
      type: String,
    },
    street: { type: String },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  { timestamps: true },
);

// Create the model
const Company = mongoose.model<TCompany>('Company', CompanySchema);

export default Company;
