import mongoose, { Schema } from 'mongoose';
import { TCompany } from './company.interface';
// Adjust path accordingly

// Define the schema based on TCompany interface
const CompanySchema = new Schema<TCompany>(
  {
    companyName: {
      type: String,
    },
    cvrNumber: {
      type: String,
      unique: true, // Ensure unique CVR number
    },
    postCode: {
      type: String,
    },
    city: {
      type: String,
    },
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
