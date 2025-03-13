/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../../config';
import { emailVerifyHtml } from '../../../shared/html/emailVerifyHtml';
import { forgotPasswordHtml } from '../../../shared/html/forgotPasswordHtml';
import { USER_STATUS } from '../../constant';
import AppError from '../../utils/AppError';
import { decodeToken } from '../../utils/decodeToken';
import generateToken from '../../utils/generateToken';
import generateUID from '../../utils/generateUID';
import { hashPassword } from '../../utils/hashPassword';
import { isMatchedPassword } from '../../utils/matchPassword';
import { OtpService } from '../otp/otp.service';
import Profile from '../profile/profile.model';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';

const registerUser = async (
  payload: Omit<IUser, 'role' | 'status' | 'isDeleted'>,
) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, 'User already exist');
  }

  const signUpData = {
    email: payload.email,
    password: payload.password,
    myRestaurant: payload.myRestaurant,
  };

  const signUpToken = generateToken(
    signUpData,
    config.jwt.sing_up_token as Secret,
    config.jwt.sing_up_expires_in as string,
  );

  const checkOtp = await OtpService.checkOtpByEmail(payload.email);

  if (checkOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Otp already exist');
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const emailBody = {
    email: payload.email,
    html: emailVerifyHtml('Email Verification', otp),
  };
  const otpExpiryTime = parseInt(config.otp_expire_in as string) || 3;

  await OtpService.sendOTP(
    emailBody,
    otpExpiryTime,
    'email',
    'email-verification',
    otp,
  );

  return { signUpToken };
};

const verifyEmail = async (token: string, otp: { otp: number }) => {
  const decodedUser = decodeToken(
    token,
    config.jwt.sing_up_token as Secret,
  ) as JwtPayload;

  if (!decodedUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }

  const checkOtpExist = await OtpService.checkOtpByEmail(decodedUser.email);
  if (!checkOtpExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Otp doesn't exist");
  }

  const otpVerify = await OtpService.verifyOTP(
    otp.otp,
    checkOtpExist?._id.toString(),
  );

  if (!otpVerify) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Otp not matched');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const createUserData = {
      UID: await generateUID(),
      email: decodedUser.email,
      password: decodedUser.password,
      myRestaurant: decodedUser.myRestaurant,
    };

    const user = await User.create([createUserData], { session });

    if (!user || user.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not created');
    }

    const userId = user[0]._id;

    const createProfileData = {
      userId: userId,
    };

    const profile = await Profile.create([createProfileData], { session });

    if (!profile || profile.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Profile not created');
    }

    const updateUser = await User.findOneAndUpdate(
      { _id: user[0]._id },
      { profile: profile[0]._id },
      { session },
    );

    if (!updateUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not updated');
    }

    await session.commitTransaction();
    session.endSession();

    const generateAccessToken = generateToken(
      {
        email: user[0].email,
        userId: userId,
        role: user[0].role,
      },
      config.jwt.access_token as Secret,
      config.jwt.access_expires_in as string,
    );

    await OtpService.deleteOtpById(checkOtpExist?._id.toString());

    return {
      user: user[0],
      profile: profile[0],
      accessToken: generateAccessToken,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const loginUser = async (payload: Pick<IUser, 'email' | 'password'>) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  const checkUserStatus = user?.status;
  if (
    checkUserStatus === USER_STATUS.BLOCKED ||
    checkUserStatus === USER_STATUS.INACTIVATED
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  const matchPassword = await isMatchedPassword(password, user?.password);

  if (!matchPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'password not matched');
  }

  const userData = {
    email: user?.email,
    userId: user?._id,
    UID: user?.UID,
    role: user?.role,
  };

  const accessToken = generateToken(
    userData,
    config.jwt.access_token as Secret,
    config.jwt.access_expires_in as string,
  );

  const refreshToken = generateToken(
    userData,
    config.jwt.refresh_token as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const logOutUser = async () => {
  return {};
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const tokenGenerate = generateToken(
    { user },
    config.jwt.forgot_password_token as Secret,
    config.jwt.forgot_password_expires_in as string,
  );

  const checkOtpExist = await OtpService.checkOtpByEmail(email);
  if (checkOtpExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Otp already exist');
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const emailBody = {
    email: email,
    html: forgotPasswordHtml('Forgot Password', otp),
  };

  const otpExpiryTime = parseInt(config.otp_expire_in as string) || 1;

  await OtpService.sendOTP(
    emailBody,
    otpExpiryTime,
    'email',
    'forget-password',
    otp,
  );
  return { forgotPasswordToken: tokenGenerate };
};

const verifyOtp = async (token: string, otp: { otp: number }) => {
  const decodedUser = decodeToken(
    token,
    config.jwt.forgot_password_token as Secret,
  ) as JwtPayload;

  if (!decodedUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }

  const checkOtpExist = await OtpService.checkOtpByEmail(
    decodedUser.user.email,
  );

  if (!checkOtpExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Otp doesn't exist");
  }

  const otpVerify = await OtpService.verifyOTP(
    otp.otp,
    checkOtpExist?._id.toString(),
  );

  if (!otpVerify) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Otp not matched');
  }

  await OtpService.deleteOtpById(checkOtpExist?._id.toString());
  return true;
};

const resetPassword = async (
  token: string,
  payload: { confirmassword: string; password: string },
) => {
  const decodedUser = decodeToken(
    token,
    config.jwt.forgot_password_token as Secret,
  ) as any;

  if (!decodedUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }


  const user = await User.findOne({ email: decodedUser?.user?.email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.password = payload.password;
  await user.save();
  return true;
};

const changePassword = async (
  token: string,
  payload: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
) => {
  const decodedUser = decodeToken(
    token,
    config.jwt.access_token as Secret,
  ) as JwtPayload;

  if (!decodedUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }

  const user = await User.findOne({ email: decodedUser.email }).select(
    '+password',
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const matchPassword = await isMatchedPassword(
    payload.oldPassword,
    user?.password,
  );

  if (!matchPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'password not matched');
  }

  // const passwordHash = await hashPassword(payload.newPassword, 10);
  // user.password = passwordHash as string;
  user.password = payload.newPassword
  user.needPasswordChange = false;
  await user.save();
  return true;
};

const resendOtp = async (
  token: string,
  payload: { email?: string; purpose: string },
) => {
  const decodedUser = decodeToken(
    token,
    payload.purpose === 'email-verification'
      ? (config.jwt.sing_up_token as Secret)
      : (config.jwt.forgot_password_token as Secret),
  ) as JwtPayload;

  const otp = Math.floor(100000 + Math.random() * 900000);

  const emailBody = {
    email:
      payload.purpose === 'email-verification'
        ? decodedUser.email
        : decodedUser.user.email,
    html:
      payload.purpose === 'email-verification'
        ? emailVerifyHtml('Email Verification', otp)
        : forgotPasswordHtml('Forget Password', otp),
  };

  const otpExpiryTime = parseInt(config.otp_expire_in as string) || 3;

  await OtpService.sendOTP(
    emailBody,
    otpExpiryTime,
    'email',
    payload.purpose,
    otp,
  );
};

const socialLogin = async (payload: any) => {
  let user;
  user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({ ...payload, isSocialLogin: true });
    const createProfileData = {
      userId: user._id,
    };

    const profile = await Profile.create(createProfileData);
    if (!profile) {
      throw new AppError(httpStatus.BAD_REQUEST, "")
    }
    await User.findByIdAndUpdate(user._id, { profile: profile._id }, { new: true })
  }

  const userData = {
    email: user?.email,
    userId: user?._id,
    UID: user?.UID,
    role: user?.role,
  };

  const accessToken = generateToken(
    userData,
    config.jwt.access_token as Secret,
    config.jwt.access_expires_in as string,
  );

  const refreshToken = generateToken(
    userData,
    config.jwt.refresh_token as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const assignRestaurant = async (userId: string, payload: { myRestaurant: string }) => {

  return await User.findByIdAndUpdate(userId, { ...payload, isSocialLogin: false }, { new: true })

}

export const AuthService = {
  resendOtp,
  loginUser,
  verifyOtp,
  logOutUser,
  verifyEmail,
  socialLogin,
  registerUser,
  resetPassword,
  forgotPassword,
  changePassword,
  assignRestaurant
};
