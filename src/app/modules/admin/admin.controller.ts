import { Request, RequestHandler, Response } from 'express';
import {  IAdmin } from './admin.interface';

import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { AdminService} from './admin.service';

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

export const AdminAuthController = {
  createAdmin,
};
