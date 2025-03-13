/* eslint-disable no-unused-vars */
import { Model, ObjectId } from 'mongoose';

export type TRole = 'admin' | 'dealer' | 'private_user';
export type TStatus = 'active' | 'deactivated' | 'blocked';
export type TGender = 'MALE' | 'FEMALE' | 'OTHERS';

export type IUser = {
  email: string;
  password: string;
  confirmPassword: string;
  role: TRole;
  status: TStatus;
  isDeleted: boolean;
  isTransportAdd: boolean;
  isSocialLogin: boolean;
  profileId: ObjectId
};

export interface UserModel extends Model<IUser> {
  isUserExist(id: string): Promise<IUser>;
  isMatchedPassword(password: string, hashPassword: string): Promise<boolean>;
  findLastUser(): Promise<IUser>;
}
