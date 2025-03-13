import { ObjectId } from 'mongoose';

export type TType =
  | 'instruction-and-guide'
  | 'disclaimer'
  | 'announcement'
  | 'privacy-policy'
  | 'terms-and-conditions'
  | 'faq';

export type TFaq = {
  title: string;
  content: string;
};

export type TStaticContent = {
  userId: ObjectId;
  type: TType;
  content?: string;
  faq?: TFaq[];
};
