/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from './AppError';
import bcrypt from 'bcrypt';

export const isMatchedPassword = async (
  password: string,
  hashPassword: string,
) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error);
  }
};
