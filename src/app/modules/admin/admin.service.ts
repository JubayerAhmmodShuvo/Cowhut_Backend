import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { AdminModel, IAdmin } from './admin.interface';
import Admin from './admin.model';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import { ILoginUser, ILoginUserResponse } from '../auth/auth.interface';

const createAdmin = async (adminData: IAdmin): Promise<IAdmin | null> => {
  try {
    if (adminData.role !== 'admin') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user role');
    }

    const newAdmin = await Admin.create(adminData);
    return newAdmin;
  } catch (error: any) {
    if (error.code === 11000) {
     
      throw new ApiError(httpStatus.CONFLICT, 'Duplicate entry');
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create admin');
  }
};

const loginAdmin = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  const isUserExist = await Admin.isUserExist(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  if (
    isUserExist.password &&
    !(await Admin.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { phoneNumber: userId, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

 
  return { accessToken, refreshToken };
};

export const AdminService = {
  createAdmin,
  loginAdmin
};
