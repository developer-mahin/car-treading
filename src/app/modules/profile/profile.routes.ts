import { Router } from 'express';
import { USER_ROLE } from '../../constant';
import { auth } from '../../middleware/auth';
import parseFormData from '../../middleware/parsedData';
import validateRequest from '../../middleware/validation';
import upload from '../../utils/uploadImage';
import { ProfileController } from './profile.controller';
import { ProfileValidation } from './profile.validation';

const router = Router();

router
  .get(
    '/my_profile',
    auth(USER_ROLE.ADMIN, USER_ROLE.RESTAURANT_OWNER, USER_ROLE.STAFF),
    ProfileController.getMyProfile,
  )
  .patch(
    '/update_profile/:profileId',
    auth(USER_ROLE.ADMIN, USER_ROLE.RESTAURANT_OWNER, USER_ROLE.STAFF),
    upload.single('profileImage'),
    parseFormData,
    validateRequest(ProfileValidation.updateProfileSchema),
    ProfileController.updateProfile,
  );

export const ProfileRoutes = router;
