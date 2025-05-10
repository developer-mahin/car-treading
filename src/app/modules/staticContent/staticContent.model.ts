import { model, Schema } from 'mongoose';
import { TStaticContent } from './staticContent.interface';

const staticContentSchema = new Schema<TStaticContent>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    type: {
      type: String,
      enum: ['privacy-policy', 'terms-and-conditions'],
      required: true,
    },
    content: { type: String },
  },
  {
    timestamps: true,
  },
);

const StaticContent = model<TStaticContent>(
  'StaticContent',
  staticContentSchema,
);
export default StaticContent;
