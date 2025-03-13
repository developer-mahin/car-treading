import { z } from 'zod';

const staticContentValidation = z.object({
  body: z.object({
    type: z.enum([
      'instruction-and-guide',
      'disclaimer',
      'announcement',
      'privacy-policy',
      'terms-and-conditions',
      'faq',
    ]),
    content: z.string({ required_error: 'Content is required' }).optional(),
    faq: z
      .array(
        z.object({
          title: z.string({ required_error: 'Title is required' }),
          content: z.string({ required_error: 'Content is required' }),
        }),
      )
      .optional(),
  }),
});

export const StaticContentValidation = {
  staticContentValidation,
};
