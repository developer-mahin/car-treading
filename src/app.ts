/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/nof-found';
import router from './app/router';

const app: Application = express();
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'https://dashboard.engrobasen.dk',
      'https://engrobasen.dk',
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }),
);

// Routes Middleware
app.use('/api/v1', router);

// Default Route
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: 'Welcome To Server',
  });
});

// Not Found Middleware
app.use(notFound);
// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;
