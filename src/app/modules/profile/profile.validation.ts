import { z } from 'zod';
const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Name must be a string',
      })
      .min(3)
      .max(50)
      .optional(),

    contactNo: z
      .string({
        invalid_type_error: 'Contact number must be a string',
      })
      .min(3)
      .max(50)
      .optional(),

    facebook: z
      .string({
        invalid_type_error: 'Facebook URL must be a string',
      })
      .min(3)
      .max(50)
      .optional(),

    instagram: z
      .string({
        invalid_type_error: 'Instagram URL must be a string',
      })
      .min(3)
      .max(50)
      .optional(),

    queryCount: z
      .number({
        invalid_type_error: 'Query count must be a number',
      })
      .min(3)
      .max(50)
      .optional(),

    location: z
      .string({
        invalid_type_error: 'Location must be a string',
      })
      .min(3)
      .max(50)
      .optional(),

    restaurantName: z
      .string({
        invalid_type_error: 'Restaurant name must be a string',
      })
      .min(3)
      .max(50)
      .optional(),

    assignedOwner: z
      .string({
        invalid_type_error: 'Assigned owner must be a string',
      })
      .min(3)
      .max(50)
      .optional(),

    totalQuery: z
      .number({
        invalid_type_error: 'Total query must be a number',
      })
      .min(3)
      .max(50)
      .optional(),
  }),
});

export const ProfileValidation = {
  updateProfileSchema,
};
