import { Router } from 'express';
import { USER_ROLE } from '../../constant';
import { auth } from '../../middleware/auth';
import { UserController } from './user.controller';

const router = Router();

router
  .get('/list', auth(USER_ROLE.admin), UserController.getAllUsersList)
  .get('/user_ratio', auth(USER_ROLE.admin), UserController.getUserRatio)
  .patch('/action/:userId', auth(USER_ROLE.admin), UserController.userAction);

export const UserRoutes = router;
