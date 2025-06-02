import { JwtPayload, Secret } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { decodeToken } from '../app/utils/decodeToken';
import config from '../config'; // Ensure jwtSecret is defined in config
import { MessageService } from '../app/modules/message/message.service';

export interface IConnectedUser {
  socketId: string;
  userId: string; // You can add other properties that `connectUser` may have
}
export const connectedUser: Map<string, object> = new Map();

const socketIO = (io: Server) => {
  // Initialize an object to store the active users
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeUsers: { [key: string]: any } = {};

  let user;
  // Middleware to handle JWT authentication
  io.use(async (socket: Socket, next) => {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.token ||
      socket.handshake.headers.authorization;

    if (!token) {
      return next(new Error('Authentication error: Token not provided.'));
    }

    console.log(connectedUser, 'connected user');

    try {
      user = decodeToken(
        token,
        config.jwt.access_token as Secret,
      ) as JwtPayload;
      activeUsers[socket.id] = user.userId;
      socket.user = { userId: user.userId, socketId: socket.id }; // Attach user info to the socket object
      if (
        socket.user.userId === undefined ||
        socket.user.socketId === undefined
      ) {
        console.log('userId or socketId is undefined');
        return;
      }
      next();
    } catch (err) {
      console.error('JWT Verification Error:', err);

      return next(new Error('Authentication error: Invalid token.'));
    }
  });

  // On new socket connection
  io.on('connection', (socket: Socket) => {
    console.log('connected', socket.id);
    if (
      socket?.user?.userId === undefined ||
      socket.user.socketId === undefined
    ) {
      console.log('userId or socketId is undefined');
      return;
    }

    connectedUser.set(socket.user.userId, { socketId: socket.user.socketId });
    // Send online users
    io.emit('onlineUser', Array.from(connectedUser.keys()));

    socket.on('send_message', async (data) => {
      try {
        await MessageService.createMessage(data);
        io.emit(`receive_message::${data.conversationId}`, data);
      } catch (error) {
        console.error('Error in send_message:', error);
      }
    });

    socket.on('typing', async (payload, callback) => {
      if (payload.status === true) {
        io.emit(`typing::${payload.receiverId}`, true);
        callback({ success: true, message: payload, result: payload });
      } else {
        io.emit(`typing::${payload.receiverId}`, false);
        callback({ success: false, message: payload, result: payload });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
      // You can remove the user from active users if needed
      delete activeUsers[socket.id];
      if (
        socket?.user?.userId === undefined ||
        socket.user.socketId === undefined
      ) {
        console.log('userId or socketId is undefined');
        return;
      }
      connectedUser.delete(socket.user.userId);
      io.emit('onlineUser', 'testing');
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });
  });
};

export default socketIO;
