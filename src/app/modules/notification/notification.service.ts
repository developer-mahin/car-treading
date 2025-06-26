import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import { TNotification } from './notification.interface';
import Notification from './notification.model';

const createNotification = async (notificationBody: TNotification) => {
  const notification = new Notification(notificationBody);
  return notification.save();
};

const getMyNotifications = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const notificationQuery = new QueryBuilder(
    Notification.find({ receiverId: user.userId }),
    query,
  );

  const result = await notificationQuery.sort().paginate().queryModel;

  const pagination = await notificationQuery.countTotal();
  return { pagination, result };
};

const getNotificationCount = async (user: TAuthUser) => {
  const result = await Notification.countDocuments({
    receiverId: user.userId,
    isRead: false,
  }).countDocuments();
  return result;
};

const notificationAction = async (user: TAuthUser) => {
  const findNotification = await Notification.find({
    receiverId: user.userId,
    isRead: false,
  });

  if (findNotification.length > 0) {
    Promise.all(
      findNotification.map(async (notification) => {
        notification.isRead = true;
        await notification.save();
      }),
    );
  }
};

export const NotificationService = {
  createNotification,
  getMyNotifications,
  getNotificationCount,
  notificationAction,
};
