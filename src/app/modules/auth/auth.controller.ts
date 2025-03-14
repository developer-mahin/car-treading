import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'check your email to verify your account',
    data: {
      signUpToken: result.signUpToken,
    },
  });
});

const createUser = catchAsync(async (req, res) => {
  req.body.profileImage = req?.file?.path;
  const result = await AuthService.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User created successfully',
    data: result,
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const otp = req.body;
  const result = await AuthService.verifyEmail(token as string, otp);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Email verified successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await AuthService.loginUser(req.body);

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const logOutUser = catchAsync(async (req, res) => {
  res.cookie('refreshToken', '', {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    expires: new Date(0),
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged out successfully',
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Email sent successfully',
    data: result,
  });
});

const verifyOtp = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const otp = req.body;
  const result = await AuthService.verifyOtp(token as string, otp);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Otp verified successfully',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('Token not found');
  }
  const result = await AuthService.resetPassword(token as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password reset successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('Token not found');
  }
  const result = await AuthService.changePassword(token as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: result,
  });
});

const resendOtp = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuthService.resendOtp(token as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Otp sent successfully',
    data: result,
  });
});

const socialLogin = catchAsync(async (req, res) => {
  const result = await AuthService.socialLogin(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: result,
  });
});

export const AuthController = {
  resendOtp,
  verifyOtp,
  loginUser,
  logOutUser,
  createUser,
  verifyEmail,
  socialLogin,
  registerUser,
  resetPassword,
  changePassword,
  forgotPassword,
};
