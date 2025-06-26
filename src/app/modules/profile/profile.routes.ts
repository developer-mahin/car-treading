import { Router } from 'express';
import { USER_ROLE } from '../../constant';
import { auth } from '../../middleware/auth';
import parseFormData from '../../middleware/parsedData';
import fileUpload from '../../utils/uploadImage';
import { ProfileController } from './profile.controller';

const upload = fileUpload('./public/uploads/images/');

const router = Router();

router
  .get(
    '/my_profile',
    auth(USER_ROLE.admin, USER_ROLE.dealer, USER_ROLE.private_user),
    ProfileController.getMyProfile,
  )

  .put(
    '/update_profile/:profileId',
    auth(USER_ROLE.private_user, USER_ROLE.admin, USER_ROLE.dealer),
    ProfileController.editProfile,
  )

  .patch(
    '/update_profile/:profileId',
    auth(USER_ROLE.private_user, USER_ROLE.admin, USER_ROLE.dealer),
    upload.fields([
      { name: 'profileImage', maxCount: 2 },
      { name: 'companyLogo', maxCount: 2 },
    ]),
    parseFormData,
    ProfileController.updateProfile,
  );

export const ProfileRoutes = router;
