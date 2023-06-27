import { Model } from 'mongoose';
import { UserRole } from '../../../enum/user';


export type IAdmin = {
  _id?: string;
  password: string;
  role: UserRole;
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  address: string;

};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;