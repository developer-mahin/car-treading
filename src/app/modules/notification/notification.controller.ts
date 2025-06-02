import { TAuthUser } from '../../interface/authUser';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationService } from './notification.service';

const getMyNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getMyNotifications(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Notifications fetched successfully',
    data: result,
  });
});

const getNotificationCount = catchAsync(async (req, res) => {
  const result = await NotificationService.getNotificationCount(
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Notification count fetched successfully',
    data: result,
  });
});

const notificationAction = catchAsync(async (req, res) => {
  const result = await NotificationService.notificationAction(
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Notification count fetched successfully',
    data: result,
  });
});

export const NotificationController = {
  getMyNotifications,
  getNotificationCount,
  notificationAction,
};
