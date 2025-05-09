/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
// types/global.d.ts
import { Server as SocketIOServer } from 'socket.io';

declare global {
  var io: SocketIOServer; // Declare 'io' as a global variable accessible throughout your app
}

export {};