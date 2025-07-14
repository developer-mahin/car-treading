/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../../config';
import { emailVerifyHtml } from '../../../shared/html/emailVerifyHtml';
import { forgotPasswordHtml } from '../../../shared/html/forgotPasswordHtml';
import { USER_ROLE, USER_STATUS } from '../../constant';
import AppError from '../../utils/AppError';
import { decodeToken } from '../../utils/decodeToken';
import generateTaskId from '../../utils/generateTaskId';
import generateToken from '../../utils/generateToken';
import generateUID from '../../utils/generateUid';
import { OtpService } from '../otp/otp.service';
import Profile from '../profile/profile.model';
import { TTask } from '../task/task.interface';
import { TaskService } from '../task/task.service';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { TRegister } from './auth.interface';

const registerUser = async (payload: TRegister) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, 'User already exist');
  }

  const signUpToken = generateToken(
    payload,
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
  const otpExpiryTime = 2;

  await OtpService.sendOTP(
    emailBody,
    otpExpiryTime,
    'email',
    'email-verification',
    otp,
  );

  return { signUpToken };
};

const createUser = async (payload: any) => {
  if (!payload) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You did not fill the form');
  }

  const findUser = await User.findOne({ email: payload.email });
  if (findUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exist');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userData = {
      email: payload.email,
      password: config.default_password as string,
      role: payload.role,
      needPasswordChange: true,
      uuid: await generateUID(),
    };

    const user = await User.create([userData], { session });
    if (!user || user.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not created');
    }

    const profileData = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      phoneNumber: payload.phoneNumber,
      address: payload.address,
      regNo: payload.regNo,
      kontoNr: payload.kontoNr,
      websiteLink: payload.websiteLink,
      cvrNumber: payload.cvrNumber,
      userId: user[0]._id,
      street: payload.street,
      city: payload.city,
      zip: payload.zip,
      country: payload.country,
      companyName: payload.companyName,
    };

    const profile = await Profile.create([profileData], { session });
    if (!profile || profile.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Profile not created');
    }

    await User.findByIdAndUpdate(
      user[0]._id,
      { profile: profile[0]._id },
      { new: true, session },
    );

    await session.commitTransaction();
    session.endSession();
    return user;
  } catch (error: any) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error);
  }
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
      email: decodedUser.email,
      password: decodedUser.password,
      role: decodedUser.role,
      isUseTransport: decodedUser.isUseTransport,
      uuid: await generateUID(),
    };

    const user = await User.create([createUserData], { session });

    if (!user || user.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not created');
    }

    const userId = user[0]._id;

    const createProfileData = {
      userId: userId,
      first_name: decodedUser.first_name,
      last_name: decodedUser.last_name,
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

    if (decodedUser.isUseTransport) {
      const admin = await User.findOne({
        role: USER_ROLE.admin,
      });
      const taskData: Omit<TTask, 'taskStatus'> = {
        assignTo: user[0]._id as any,
        taskTitle: 'Complete your profile',
        taskDescription:
          'A task created for you for complete the order transport management system',
        deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
        taskId: await generateTaskId(),
      };

      await TaskService.createTask(taskData, admin as any);
    }

    const generateAccessToken = generateToken(
      {
        email: user[0].email,
        userId: userId,
        role: user[0].role,
        profile: profile[0]._id,
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
    checkUserStatus === USER_STATUS.blocked ||
    checkUserStatus === USER_STATUS.deactivated
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  //  await isMatchedPassword(password, user?.password);

  const matchPassword = await User.isMatchedPassword(password, user?.password);

  if (!matchPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'password not matched');
  }

  const userData = {
    email: user?.email,
    userId: user?._id,
    role: user?.role,
    profile: user?.profile,
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
  const tokenGenerate = generateToken(
    decodedUser.user,
    config.jwt.reset_password_token as Secret,
    config.jwt.reset_password_expires_in as string,
  );
  return { resetPasswordToken: tokenGenerate };
};

const resetPassword = async (
  token: string,
  payload: { confirmPassword: string; password: string },
) => {
  const decodedUser = decodeToken(
    token,
    config.jwt.reset_password_token as Secret,
  ) as any;

  if (!decodedUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }

  const user = await User.findOne({ email: decodedUser?.email }).select(
    '+password',
  );
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

  const matchPassword = await User.isMatchedPassword(
    payload.oldPassword,
    user?.password,
  );

  if (!matchPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'password not matched');
  }

  user.password = payload.newPassword;
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
    user = await User.create({ email: payload.email, isSocialLogin: true });
    const createProfileData = {
      userId: user._id,
      ...payload,
    };

    const profile = await Profile.create(createProfileData);
    if (!profile) {
      throw new AppError(httpStatus.BAD_REQUEST, '');
    }
    await User.findByIdAndUpdate(
      user._id,
      { profile: profile._id },
      { new: true },
    );
  }

  const userData = {
    email: user?.email,
    userId: user?._id,
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

export const AuthService = {
  resendOtp,
  loginUser,
  createUser,
  verifyOtp,
  logOutUser,
  verifyEmail,
  socialLogin,
  registerUser,
  resetPassword,
  forgotPassword,
  changePassword,
};
