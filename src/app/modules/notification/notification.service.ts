import { TNotification } from "./notification.interface";
import Notification from "./notification.model";

const createNotification = async (notificationBody: TNotification) => {
    const notification = new Notification(notificationBody);
    return notification.save();
}

export const NotificationService = {
    createNotification,
}