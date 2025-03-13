import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { UserController } from './user.controller';

const router = Router();

router
  .get('/user_list', auth(USER_ROLE.ADMIN), UserController.getAllUsersList)
  .get('/user_ratio', auth(USER_ROLE.ADMIN), UserController.getUserRatio)
  .patch('/action/:userId', auth(USER_ROLE.ADMIN), UserController.userAction);

export const UserRoutes = router;
