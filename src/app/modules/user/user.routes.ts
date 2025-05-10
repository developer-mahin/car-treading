import { Router } from 'express';
import { USER_ROLE } from '../../constant';
import { auth } from '../../middleware/auth';
import { UserController } from './user.controller';

const router = Router();

router
  .post(
    '/order-transport',
    auth(USER_ROLE.dealer),
    UserController.orderTransport,
  )
  .get('/list', auth(USER_ROLE.admin), UserController.getAllUsersList)
  .get('/user_ratio', auth(USER_ROLE.admin), UserController.getUserRatio)
  .get('/total_count', auth(USER_ROLE.admin), UserController.getTotalCount)
  .get('/customer_map', auth(USER_ROLE.admin), UserController.getCustomerMap)
  .get('/:userId', auth(USER_ROLE.admin), UserController.userDetails)
  .patch('/action/:userId', auth(USER_ROLE.admin), UserController.userAction);

export const UserRoutes = router;
