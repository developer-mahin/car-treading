import { z } from 'zod';

const feedbackValidation = z.object({
  body: z.object({
    comment: z.string({ required_error: 'Comment is required' }),
  }),
});

const feedbackUpdateValidation = z.object({
  body: z.object({
    status: z.enum(['pending', 'resolved', 'rejected'], {
      required_error: 'Status is required',
    }),
  }),
});

export const FeedbackValidation = {
  feedbackValidation,
  feedbackUpdateValidation,
};
