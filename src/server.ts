import colors from 'colors';
import { createServer, Server } from 'http';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io'; // For better type safety
import app from './app'; // Your express app
import seedAdmin from './app/DB/seedAdmin';
import config from './config'; // Ensure config has the right properties for your setup
import socketIO from './socket/socket';

const socketServer = createServer(); // HTTP server for Socket.IO

// Initialize Socket.IO with type safety
let server: Server;
export const IO: SocketIOServer = new SocketIOServer(socketServer, {
  cors: {
    origin: '*', // Change this to the actual client URL in production
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database_url as string);
    console.log(colors.yellow('✅ Database connected successfully').bold);

    // Start Express server
    server = app.listen(Number(config.port), () => {
      console.log(
        colors.green(`App is listening on ${config.ip}:${config.port}`).bold,
      );
    });

    // Start Socket.IO server
    socketServer.listen(config.socket_port || 6000, () => {
      console.log(
        colors.green(
          `✅ Socket server is running on ${config.ip}:${config.socket_port}`,
        ).bold,
      );
    });

    // Pass Socket.IO instance to socketIO module
    socketIO(IO);
    globalThis.io = IO; // Store io in global for access throughout your app

  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1); // Exit after error
  }
}

main();
seedAdmin(); // Seed admin if needed

// Graceful shutdown for unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled rejection detected: ${err}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1); // Ensure process exits
});

// Graceful shutdown for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught exception detected: ${err}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
