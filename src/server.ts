/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import colors from 'colors';
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import seedAdmin from './app/DB/seedAdmin';
import config from './config';
import { errorLogger, logger } from './shared/logger';
let server: Server;

// Connect to database and start the server
async function main() {
  try {
    await mongoose.connect(config.database_url as string).then(() => {
      console.log('Database connected successfully');
    });

    server = app.listen(config.port, () => {
      console.log(
        colors.green(
          `Server is running successfully ${config.ip}:${config.port}`,
        ).bold,
      );
      logger.info(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
// Seed Admin in database if not exist
seedAdmin();

// Handle unhandled promise rejection
process.on('unhandledRejection', (err: any) => {
  console.log(`👹 unhandledRejection is detected, shuting down....`, err);
  errorLogger.error(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Handle uncaught exception
process.on('uncaughtException', (err: any) => {
  console.log(`👹 uncaughtException is detected, shuting down....`, err);
  errorLogger.error(err);
  process.exit(1);
});
