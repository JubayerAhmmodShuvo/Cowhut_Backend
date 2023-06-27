import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { AdminModel, IAdmin } from './admin.interface';
import Admin from './admin.model';

 const createAdmin = async (adminData: IAdmin): Promise<IAdmin|null> => {
  try {
    const newAdmin = await Admin.create(adminData);
    return newAdmin;
  } catch (error:any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,'Failed to create admin');
  }
};

export const AdminService = {
  createAdmin
}