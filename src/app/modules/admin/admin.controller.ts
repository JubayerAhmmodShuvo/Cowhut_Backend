import { Request, RequestHandler, Response } from 'express';
import { IAdmin } from './admin.interface';
import jwt from 'jsonwebtoken'; 
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { AdminService } from './admin.service';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface';
import config from '../../../config';

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { password, role, name, phoneNumber, address } = req.body;

    const adminData: IAdmin = {
      password,
      role,
      name,
      phoneNumber,
      address,
      toObject: undefined
    };
    const newAdmin = await AdminService.createAdmin(adminData);

    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully',
      data: newAdmin,
    });
  }
);
const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AdminService.loginAdmin(loginData);
  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin logged in successfully !',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AdminService.refreshToken(refreshToken);

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Admin logged in successfully !',
    data: result,
  });
});

interface UserPayload extends jwt.JwtPayload {
  id: string;
}
const getMyProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.user as UserPayload;
    const admin = await AdminService.getProfile(id);
    if (admin) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin retrieved successfully',
        data: admin,
      });
    }
  }
);

const updateAdminProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.user as UserPayload;

    const updatedData = req.body;

    try {
      const admin = await AdminService.getProfile(id);

      if (!admin) {
        return sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: 'Admin not found',
        });
      }

      const updatedUser = { ...admin.toObject(), ...updatedData };
      const savedUser = await AdminService.updateProfile(id, updatedUser);

      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin profile updated successfully',
        data: savedUser,
      });
    } catch (error) {
      return sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to update admin profile',
      });
    }
  }
);

export const AdminAuthController = {
  createAdmin,
  loginAdmin,
  refreshToken,
  getMyProfile,
  updateAdminProfile,
};
