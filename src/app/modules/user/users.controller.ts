import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './users.service';
import catchAsync from '../../../shared/catchAsync';
import { IUser } from './users.interface';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const user = await UserService.createUser(req.body);
      sendResponse<IUser>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User created successfully',
        data: user,
     
      });
    } catch (error:any) {
      sendResponse<IUser>(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create user',
        data: null,
         stack: error.stack
      });
    }
  }
);

const getAllUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUsers();
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error:any) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve users',
        data: null,
       
        stack: error.stack,
        
        
      });
    }
  }
);

const getUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      if (user) {
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'User retrieved successfully',
          data: user,
        });
      } else {
        sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: 'User not found',
          data: null,
        });
      }
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve user',
        data: null,
      });
    }
  }
);

const updateUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserService.updateUserById(id, req.body);
      if (user) {
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'User updated successfully',
          data: user,
        });
      } else {
        sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: 'User not found',
          data: null,
        });
      }
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update user',
        data: null,
      });
    }
  }
);

const deleteUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserService.deleteUserById(id);
      if (user) {
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'User deleted successfully',
          data: user,
        });
      } else {
        sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: 'User not found',
          data: null,
        });
      }
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to delete user',
        data: null,
      });
    }
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
