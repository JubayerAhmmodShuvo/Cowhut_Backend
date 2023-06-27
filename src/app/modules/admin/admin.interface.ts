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


export type AdminModel = {
  isUserExist(
    phoneNumber: string
  ): Promise<Pick<IAdmin, 'phoneNumber' | 'password'|'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;
