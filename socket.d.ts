import 'socket.io';

declare module 'socket.io' {
    interface Socket {
        user?: { userId: string; socketId: string }; // Add 'user' property to Socket
    }
}