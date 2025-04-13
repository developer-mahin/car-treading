/* eslint-disable no-var */
// types/global.d.ts
import { Server } from 'socket.io';

declare global {
  var io: Server; // Declare 'io' as a global variable accessible throughout your app
}

export {};