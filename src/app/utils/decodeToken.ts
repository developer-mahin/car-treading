/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { Secret } from 'jsonwebtoken';

export const decodeToken = (token: string, secretKey: Secret) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
