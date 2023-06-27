import { Request, RequestHandler, Response } from 'express';
import {  IAdmin } from './admin.interface';

import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { AdminService} from './admin.service';
import { ILoginUserResponse } from '../auth/auth.interface';

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
  try {
    const { password, role, name, phoneNumber, address } = req.body;

    const adminData: IAdmin = {
      password,
      role,
      name,
      phoneNumber,
      address,
    };
    const newAdmin = await AdminService.createAdmin(adminData);

    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully',
      data: newAdmin
    });
  } catch (error) {
    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Failed to create Admin',
      data: null,
    });
  }
}
)
const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const { ...loginData } = req.body;
  const result = await AdminService.loginAdmin(loginData);
  // const { refreshToken, ...others } = result;

  // const cookieOptions = {
  //   secure: config.env === 'production',
  //   httpOnly: true,
  // };

  // res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully !',
    data: result
  });
});

export const AdminAuthController = {
  createAdmin,
  loginAdmin
};
