import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { NotificationController } from './notification.controller';

const router = Router();

router
  .get(
    '/my_notifications',
    auth(USER_ROLE.private_user, USER_ROLE.dealer, USER_ROLE.admin),
    NotificationController.getMyNotifications,
  )
  .get(
    '/notification_count',
    auth(USER_ROLE.private_user, USER_ROLE.dealer, USER_ROLE.admin),
    NotificationController.getNotificationCount,
  )
  .patch(
    '/action',
    auth(USER_ROLE.private_user, USER_ROLE.dealer, USER_ROLE.admin),
    NotificationController.notificationAction,
  );

export const NotificationRoutes = router;
