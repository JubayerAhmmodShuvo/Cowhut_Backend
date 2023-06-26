import { Model } from 'mongoose';
import { UserRole } from '../../../enum/user';

export type IUser = {
  _id?: string;
  password: string;
  role: UserRole;
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;
};

export type UserModel = Model<IUser, Record<string, unknown>>;
