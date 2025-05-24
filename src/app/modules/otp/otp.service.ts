/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../utils/AppError';
import sendMail from '../../utils/sendMail';
import OTP from './otp.model';

const sendOTP = async (
  payload: any,
  otpExpiryTime?: number,
  receiverType?: string,
  purpose?: string,
  otp?: number,
) => {
  const subject =
    purpose === 'email-verification' ? 'Email Verification' : 'Forget Password';
  if (receiverType === 'email') {
    const emailBody = {
      email: payload.email,
      subject: subject,
      html: payload.html,
    };
    await sendMail(emailBody);
  }

  const findExistingOtp = await OTP.findOne({
    sendTo: payload.email,
    receiverType,
    purpose,
  });

  if (findExistingOtp) {
    await OTP.findByIdAndDelete(findExistingOtp._id);
  }

  // return
  // const otpExpiryTime = parseInt(config.otp_expire_in as string) || 3;
  const expiredAt = new Date();
  expiredAt.setMinutes(expiredAt.getMinutes() + otpExpiryTime!);

  const newOtp = await OTP.create({
    sendTo: payload.email,
    receiverType,
    purpose,
    otp,
    expiredAt: expiredAt,
  });

  setTimeout(async () => {
    try {
      await OTP.findByIdAndDelete(newOtp._id);
      console.log('Otp deleted ');
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'something went wrong',
      );
    }
  }, 180000);

  return true;
};

const checkOtpByEmail = async (email: string) => {
  const data = await OTP.findOne({
    sendTo: email,
    status: 'pending',
    expiredAt: { $gt: new Date() },
  });

  return data;
};

const verifyOTP = async (otp: number, id: string) => {
  const data = await OTP.findOne({
    _id: new mongoose.Types.ObjectId(String(id)),
  });

  if (!data) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Otp not found');
  }

  if (Number(data.otp) !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Otp not matched');
  }

  data.status = 'verified';
  data.verifiedAt = new Date();
  await data.save();
  return true;
};

const deleteOtpById = async (id: string) => {
  return await OTP.findByIdAndDelete(id);
};

const deletedExpiredOtp = async () => {
  const currentTime = new Date();
  await OTP.deleteMany({ expiredAt: { $lt: currentTime } });
};

setTimeout(async () => {
  try {
    await deletedExpiredOtp();
    console.log('expired otp deleted');
  } catch (error) {
    console.error(error);
  }
}, 60000);

export const OtpService = {
  sendOTP,
  checkOtpByEmail,
  verifyOTP,
  deleteOtpById,
};
