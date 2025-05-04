import { Router } from 'express';
import { USER_ROLE } from '../../constant';
import { auth } from '../../middleware/auth';
import parseFormData from '../../middleware/parsedData';
import validateRequest from '../../middleware/validation';
import { ProfileController } from './profile.controller';
import { ProfileValidation } from './profile.validation';
import fileUpload from '../../utils/uploadImage';


const upload  = fileUpload("./public/uploads/images/")

const router = Router();

router
  .get(
    '/my_profile',
    auth(USER_ROLE.admin, USER_ROLE.dealer, USER_ROLE.private_user),
    ProfileController.getMyProfile,
  )
  .patch(
    '/update_profile/:profileId',
    auth(USER_ROLE.private_user, USER_ROLE.admin, USER_ROLE.dealer),
    upload.single('profileImage'),
    parseFormData,
    validateRequest(ProfileValidation.updateProfileSchema),
    ProfileController.updateProfile,
  );

export const ProfileRoutes = router;
