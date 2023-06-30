import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IUser } from '../user/users.interface';
import User from '../user/users.model';
import { IAdmin } from '../admin/admin.interface';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

const createUser = async (userData: IUser): Promise<IUser | null> => {
  try {
    const { role, budget, income } = userData;

    if (role === 'buyer') {
      if (budget === undefined || budget <= 0) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Budget must be greater than zero for a buyer'
        );
      }
      userData.income = 0;
    } else if (role === 'seller') {
      if (income === undefined || income < 0) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Invalid income for a seller'
        );
      }
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user role');
    }

    if (budget === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Budget must be greater than zero'
      );
    }

    const existingUser = await User.findOne({
      phoneNumber: userData.phoneNumber,
    });
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already exists');
    }

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
 
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  }
};


const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  const isUserExist = await User.isUserExist(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { _id: id, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  const isUserExist = await User.isUserExist(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist._id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
};
