import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import parseFormData from '../../middleware/parsedData';
import fileUpload from '../../utils/uploadImage';
const upload = fileUpload('./public/uploads/images/');

const router = Router();

router
  .post(
    '/register',
    validateRequest(AuthValidation.registration),
    AuthController.registerUser,
  )
  .post(
    '/create_user',
    auth(USER_ROLE.admin),
    upload.single('profileImage'),
    parseFormData,
    AuthController.createUser,
  )
  .post(
    '/verify_email',
    validateRequest(AuthValidation.otpValidation),
    AuthController.verifyEmail,
  )
  .post(
    '/login',
    validateRequest(AuthValidation.loginValidation),
    AuthController.loginUser,
  )
  .post(
    '/forgot_password',
    validateRequest(AuthValidation.forgotPasswordValidation),
    AuthController.forgotPassword,
  )
  .post(
    '/verify_otp',
    validateRequest(AuthValidation.otpValidation),
    AuthController.verifyOtp,
  )
  .post(
    '/reset_password',
    validateRequest(AuthValidation.resetPasswordValidation),
    AuthController.resetPassword,
  )
  .post(
    '/change_password',
    validateRequest(AuthValidation.changePasswordValidation),
    AuthController.changePassword,
  )
  .post('/resend_otp', AuthController.resendOtp)
  .post('/logout', AuthController.logOutUser)
  .post('/social_login', AuthController.socialLogin);

export const AuthRoutes = router;
