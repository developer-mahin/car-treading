import { model, Schema } from 'mongoose';
import { TFaq, TStaticContent } from './staticContent.interface';

const faqSchema = new Schema<TFaq>({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const staticContentSchema = new Schema<TStaticContent>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    type: {
      type: String,
      enum: [
        'instruction-and-guide',
        'disclaimer',
        'announcement',
        'privacy-policy',
        'terms-and-conditions',
        'faq',
      ],
      required: true,
    },
    content: { type: String },
    faq: { type: [faqSchema] },
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
