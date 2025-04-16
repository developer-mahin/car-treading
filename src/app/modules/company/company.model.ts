import mongoose, { Schema } from 'mongoose';
import { TCompany } from './company.interface';
// Adjust path accordingly

// Define the schema based on TCompany interface
const CompanySchema = new Schema<TCompany>({
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
    },
    cvrNumber: {
        type: String,
        required: [true, 'CVR number is required'],
        unique: true,  // Ensure unique CVR number
    },
    postCode: {
        type: String,
        required: [true, 'Post code is required'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
    },
    first_name: {
        type: String,
        required: [true, 'First name is required'],
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function (v: string) {
                // Basic phone number validation (adjust regex as needed)
                return /\d{10}/.test(v);
            },
            message: 'Phone number must be 10 digits',
        },
    },
}, { timestamps: true });

// Create the model
const Company = mongoose.model<TCompany>('Company', CompanySchema);

export default Company;
