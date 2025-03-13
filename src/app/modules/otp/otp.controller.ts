import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { OtpService } from './otp.service';

const sendOTP = catchAsync(async (req, res) => {
  const result = await OtpService.sendOTP(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'OTP sent successfully',
    data: result,
  });
});

export const OtpController = {
  sendOTP,
};
