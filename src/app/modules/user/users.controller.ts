import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './users.service';
import catchAsync from '../../../shared/catchAsync';
import { IUser } from './users.interface';
import jwt from 'jsonwebtoken';

const getAllUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  }
);

const getUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    if (user) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: user,
      });
    }
  }
);

const updateUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await UserService.updateUserById(id, req.body);
    if (user) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    }
  }
);

const deleteUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await UserService.deleteUserById(id);
    if (user) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User deleted successfully',
        data: user,
      });
    }
  }
);

interface UserPayload extends jwt.JwtPayload {
  id: string;
}
const getMyProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.user as UserPayload;

    const user = await UserService.getProfile(id);
    if (user) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: user,
      });
    }
  }
);

const updateMyProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.user as UserPayload;

    const updatedData = req.body;

    try {
      const user = await UserService.getProfile(id);

      if (!user) {
        return sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: 'User not found',
        });
      }

      const updatedUser = { ...user.toObject(), ...updatedData };
      const savedUser = await UserService.updateProfile(id, updatedUser);

      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User profile updated successfully',
        data: savedUser,
      });
    } catch (error) {
      return sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update user profile',
      });
    }
  }
);

export const UserController = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getMyProfile,
  updateMyProfile,
};
