import mongoose, { Schema } from 'mongoose';
import { TCar } from './car.interface';
// Adjust path accordingly

// Define the schema based on TCar interface
const CarSchema = new Schema<TCar>({
    carOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming the car owner is a User, adjust if different
        required: [true, 'Car owner is required'],
    },
    carDealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming the car dealer is a Dealer, adjust if different
        required: [true, 'Car dealer is required'],
    },
    carModelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarModel', // Assuming this references a car model collection
        required: [true, 'Car model is required'],
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Assuming this references a company collection
        required: [true, 'Company ID is required'],
    },
    noOfKmDriven: {
        type: Number,
        required: [true, 'Number of kilometers driven is required'],
        min: [0, 'Kilometers driven cannot be negative'],
    },
    noOfVarnishField: {
        type: Number,
        required: [true, 'Number of varnish fields is required'],
        min: [0, 'Varnish fields cannot be negative'],
    },
    additionalEquipment: {
        type: String,
        required: [true, 'Additional equipment information is required'],
    },
    condition: {
        type: String,
        required: [true, 'Condition of the car is required'],
        enum: ['new', 'used', 'refurbished'], // Adjust conditions if necessary
        message: 'Condition must be one of the following: new, used, refurbished',
    },
    comment: {
        type: String,
    },
    expectedPrice: {
        type: Number,
        required: [true, 'Expected price is required'],
        min: [0, 'Price cannot be negative'],
    },
    registrationNumber: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true, // Ensure unique registration numbers
    },
    vat: {
        type: Number,
        required: [true, 'VAT is required'],
        min: [0, 'VAT cannot be negative'],
    },
    carCategory: {
        type: String,
        required: [true, 'Car category is required'],
    },
    milage: {
        type: Number,
        required: [true, 'Mileage is required'],
        min: [0, 'Mileage cannot be negative'],
    },
    firstRegistrationDate: {
        type: String,
        required: [true, 'First registration date is required'],
    },
    chassisNumber: {
        type: String,
        required: [true, 'Chassis number is required'],
        unique: true, // Ensure unique chassis numbers
    },
    tax: {
        type: Number,
        required: [true, 'Tax is required'],
        min: [0, 'Tax cannot be negative'],
    },
    inspectionDate: {
        type: Date,
        required: [true, 'Inspection date is required'],
    },
}, { timestamps: true });

// Create the model
const Car = mongoose.model<TCar>('Car', CarSchema);

export default Car;
