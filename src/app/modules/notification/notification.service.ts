import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import { TNotification } from './notification.interface';
import Notification from './notification.model';

const createNotification = async (notificationBody: TNotification) => {
  const notification = new Notification(notificationBody);
  return notification.save();
};

const getMyNotifications = async (user: TAuthUser, query: Record<string, unknown>) => {
  const notificationQuery = new QueryBuilder(Notification.find({ receiverId: user.userId }), query);

  const result = await notificationQuery
    .paginate()
    .sort()
    .queryModel

  const pagination = await notificationQuery.countTotal();
  return { pagination, result };
}

export const NotificationService = {
  createNotification,
  getMyNotifications
};
