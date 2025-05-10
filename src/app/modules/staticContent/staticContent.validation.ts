import { z } from 'zod';

const staticContentValidation = z.object({
  body: z.object({
    type: z.enum(['privacy-policy', 'terms-and-conditions']),
    content: z.string({ required_error: 'Content is required' }).optional(),
  }),
});

export const StaticContentValidation = {
  staticContentValidation,
};
