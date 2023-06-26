import User from './users.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IUser } from './users.interface';

const createUser = async (userData: IUser): Promise<IUser | null> => {
  try {
    const newUser = await User.create(userData);
    return newUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
      } else {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Failed to create user'
        );
      }
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create user'
      );
    }
  }
};

const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve users'
    );
  }
};

const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve user'
    );
  }
};

const updateUserById = async (
  id: string,
  userData: IUser
): Promise<IUser | null> => {
  try {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    return user;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update user'
    );
  }
};

const deleteUserById = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findByIdAndDelete(id);
    return user;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete user'
    );
  }
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
