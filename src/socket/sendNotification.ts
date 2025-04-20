import { TAuthUser } from '../app/interface/authUser';
import { NotificationService } from '../app/modules/notification/notification.service';
import { IO } from '../server';
import { connectedUser } from './socket';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendNotification = async (user: TAuthUser, data: any) => {
  try {
    const { receiverId } = data;
    const notificationData = {
      ...data,
      senderId: user.userId || user._id,
      role: user.role,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connectUser: any = connectedUser.get(receiverId);

    if (connectUser) {
      IO.to(connectUser.socketId).emit('notification', {
        success: true,
        data: notificationData,
      });
    }

    await NotificationService.createNotification(notificationData);
  } catch (error) {
    console.error('Error in sendNotification:', error);
  }
};

export default sendNotification;
