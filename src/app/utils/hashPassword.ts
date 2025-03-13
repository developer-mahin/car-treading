/* eslint-disable no-console */
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string, saltRound: number) => {
  try {
    return await bcrypt.hash(password, saltRound);
  } catch (error) {
    console.log(error);
  }
};
