import { Router } from 'express';
import { USER_ROLE } from '../../constant';
import { auth } from '../../middleware/auth';
import { MessageController } from './message.controller';
import fileUpload from '../../utils/uploadImage';

const upload = fileUpload('./public/uploads/images/');

const router = Router();

router
  .post(
    '/upload_image',
    auth(USER_ROLE.dealer, USER_ROLE.private_user),
    upload.single('image'),
    MessageController.uploadImage,
  )
  .delete(
    '/delete_image',
    auth(USER_ROLE.dealer, USER_ROLE.private_user),
    MessageController.deleteImage,
  );

export const MessageRoutes = router;
