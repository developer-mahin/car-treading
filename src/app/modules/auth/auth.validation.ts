import { z } from 'zod';

const registration = z.object({
  body: z
    .object({
      email: z.string({ required_error: 'Email is required' }).email().max(50),
      password: z.string({ required_error: 'Password is required' }).min(8),
      confirmPassword: z.string({
        required_error: 'Confirm password is required',
      }),
      first_name: z.string({ required_error: 'first name is required' }),
      last_name: z.string({ required_error: 'last name is required' }),
      role: z.enum(['dealer', 'private_user'], {
        required_error: 'Role is required',
      }),
      isUseTransport: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

const userCreateValidation = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15),
  address: z.string().min(1, 'Address is required'),
  email: z.string().email('Invalid email format'),
  regNo: z.string().min(1, 'Registration number is required'),
  kontoNr: z.string().min(1, 'Account number is required'),
  websiteLink: z.string().url('Invalid URL format'),
  cvrNumber: z.string().optional(),
  role: z.enum(['dealer', 'private_user'], {
    required_error: 'Role is required',
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
  body: z
    .object({
      confirmPassword: z.string({ required_error: 'Email is required' }).min(8),
      password: z.string({ required_error: 'Password is required' }).min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
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
  userCreateValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
};
