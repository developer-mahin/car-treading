/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { Secret } from 'jsonwebtoken';
import AppError from './AppError';
import httpStatus from 'http-status';

const generateToken = (payload: any, secretKey: Secret, expiresIn: string) => {
  if (typeof payload !== 'object' || !payload) {
    throw new Error('payload must be a none empty object');
  }
  if (typeof secretKey !== 'string' || secretKey === '') {
    throw new Error('secret key must be a none empty string');
  }
  try {
    return jwt.sign(payload, secretKey, { expiresIn });
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

export default generateToken;
