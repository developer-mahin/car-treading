import { TAuthUser } from "../app/interface/authUser";
import { NotificationService } from "../app/modules/notification/notification.service";
import { IO } from "../server";
import { connectedUser } from "./socket";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendNotification = async (user: TAuthUser, data: any) => {
    try {
        const { receiverId } = data;
        const notificationData = {
            ...data,
            senderId: user.userId,
            role: user.role,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const connectUser : any = connectedUser.get(receiverId)
        console.log(connectUser, "connectUser")

        if (connectUser) {
            IO.to(connectUser.socketId).emit("notification", {
                success: true,
                data: notificationData
            });
        }
        // Emit notification to the receiver
        console.log(data, "data from socket")
        // Save the notification to the database
        await NotificationService.createNotification(notificationData);
    } catch (error) {
        console.error("Error in sendNotification:", error);
    }


};

export default sendNotification;