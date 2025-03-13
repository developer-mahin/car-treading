import { z } from 'zod';

const registration = z.object({
  body: z
    .object({
      email: z.string({ required_error: 'Email is required' }).email().max(50),
      password: z.string({ required_error: 'Password is required' }).min(8),
      confirmPassword: z.string({
        required_error: 'Confirm password is required',
      }),
      myRestaurant: z.string({ required_error: 'My Restaurant is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

const otpValidation = z.object({
  body: z.object({
    otp: z.number({ required_error: 'OTP is required' }),
  }),
});

const loginValidation = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email().max(50),
    password: z.string({ required_error: 'Password is required' }).min(8),
  }),
});

const forgotPasswordValidation = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
  }),
});

const resetPasswordValidation = z.object({
  body: z.object({
    confirmPassword: z.string({ required_error: 'Email is required' }).min(8),
    password: z.string({ required_error: 'Password is required' }).min(8),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

const changePasswordValidation = z.object({
  body: z
    .object({
      oldPassword: z
        .string({ required_error: 'Old password is required' })
        .min(8),
      newPassword: z
        .string({ required_error: 'New password is required' })
        .min(8),
      confirmPassword: z.string({
        required_error: 'Confirm password is required',
      }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

export const AuthValidation = {
  registration,
  loginValidation,
  otpValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
};
