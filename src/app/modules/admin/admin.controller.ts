import { Request, RequestHandler, Response } from 'express';
import {  IAdmin } from './admin.interface';

import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { AdminService} from './admin.service';
import { ILoginUserResponse, IRefreshTokenResponse } from '../auth/auth.interface';
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
    };
    const newAdmin = await AdminService.createAdmin(adminData);

    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully',
      data: newAdmin
    });
}
)
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
    data: others
  });
 } 
)
 

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

export const AdminAuthController = {
  createAdmin,
  loginAdmin,
  refreshToken
};
