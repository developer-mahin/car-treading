import { z } from 'zod';

export const validateUser = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(3).max(50),
    email: z.string({ required_error: 'Email is required' }).email().max(50),
    password: z.string({ required_error: 'Password is required' }).min(8),
    contactNo: z
      .string({ required_error: 'Contact number is required' })
      .min(10)
      .max(15),
    profileImage: z.string({ required_error: 'Profile image is required' }),
  }),
});
