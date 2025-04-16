import mongoose, { Schema } from 'mongoose';
import { TCarModel } from './carModel.interface';


// Define the schema based on TCarModel interface
const CarModelSchema = new Schema<TCarModel>({
    images: {
        type: [String],
        required: [true, 'Car images are required'],
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
    },
    model: {
        type: String,
        required: [true, 'Car model is required'],
    },
    variant: {
        type: String,
        required: [true, 'Car variant is required'],
    },
    color: {
        type: String,
        required: [true, 'Car color is required'],
    },
    fuelType: {
        type: String,
        required: [true, 'Fuel type is required'],
        enum: ['petrol', 'diesel', 'electric', 'hybrid'],  // Adjust fuel types as per your requirements
        message: 'Fuel type must be one of the following: petrol, diesel, electric, hybrid',
    },
    gearBox: {
        type: String,
        required: [true, 'Gearbox type is required'],
        enum: ['manual', 'automatic'],  // Adjust gearbox types if necessary
        message: 'Gearbox must be one of the following: manual, automatic',
    },
    engineSize: {
        type: String,
        required: [true, 'Engine size is required'],
    },
    enginePerformance: {
        type: String,
        required: [true, 'Engine performance is required'],
    },
    co2Emission: {
        type: String,
        required: [true, 'CO2 emission is required'],
    },
    fuelConsumption: {
        type: String,
        required: [true, 'Fuel consumption is required'],
    },
    euroStandard: {
        type: String,
        required: [true, 'Euro standard is required'],
    },
    numberPlates: {
        type: String,
        required: [true, 'Number plates are required'],
        unique: true,  // Ensure unique number plates
    },
}, { timestamps: true });

// Create the model
const CarModel = mongoose.model<TCarModel>('CarModel', CarModelSchema);

export default CarModel;
