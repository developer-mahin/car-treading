import { model, Schema } from 'mongoose';
import { TBrandModel } from './brandModel.interface';

const brandModelSchema = new Schema<TBrandModel>(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    image: {
      type: String,
      required: [true, 'image is required'],
    },
  },
  {
    timestamps: true,
  },
);

const BrandModel = model<TBrandModel>('BrandModel', brandModelSchema);
export default BrandModel;
