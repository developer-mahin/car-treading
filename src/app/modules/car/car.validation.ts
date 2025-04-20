import { z } from 'zod';

const carListingValidationSchema = z.object({
  body: z.object({}),
});

export const CarValidation = {
  carListingValidationSchema,
};
