import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IUser } from '../user/users.interface';
import User from '../user/users.model';

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

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  }
};

export const UserService = {
  createUser,
};
