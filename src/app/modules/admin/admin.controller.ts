import { Request, Response } from 'express';
import {  IAdmin } from './admin.interface';
import Admin from './admin.model';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { password, role, name, phoneNumber, address } = req.body;

    const adminData: IAdmin = {
      password,
      role,
      name,
      phoneNumber,
      address,
    };
    const newAdmin = await Admin.create(adminData);

    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully',
      data: newAdmin
    });
  } catch (error) {
    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Failed to create admin',
      data: null,
    });
  }
};

export const AdminAuthController = {
  createAdmin,
};
