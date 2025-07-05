import mongoose, { Schema } from 'mongoose';
import { TCarModel } from './carModel.interface';

// Define the schema based on TCarModel interface
const CarModelSchema = new Schema<TCarModel>(
  {
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
    modelYear: {
      type: Number,
      required: [true, 'Model year is required'],
    },
    variant: {
      type: String,
      required: [true, 'Car variant is required'],
    },
    color: {
      type: String,
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
    },
    gearBox: {
      type: String,
    },
    engineSize: {
      type: String,
    },
    enginePerformance: {
      type: String,
    },
    co2Emission: {
      type: String,
    },
    fuelConsumption: {
      type: String,
    },
    euroStandard: {
      type: String,
    },
    numberPlates: {
      type: String,
      required: [true, 'Number plates are required'],
      // unique: true, // Ensure unique number plates
    },
  },
  { timestamps: true },
);

// Create the model
const CarModel = mongoose.model<TCarModel>('CarModel', CarModelSchema);

export default CarModel;
