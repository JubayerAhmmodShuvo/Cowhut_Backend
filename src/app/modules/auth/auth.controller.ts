import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { UserService } from '../user/users.service';
import { IUser } from '../user/users.interface';
import sendResponse from '../../../shared/sendResponse';

const createUser = async (req: Request, res: Response) => {
  try {
    const { password, role, name, phoneNumber, address, budget, income } =
      req.body;

    const userData: IUser = {
      phoneNumber,
      role,
      password,
      name: {
        firstName: name.firstName,
        lastName: name.lastName,
      },
      address,
      budget,
      income,
    };

    const newUser = await UserService.createUser(userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    sendResponse<IUser>(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Failed to create user',
      data: null,
    });
  }
};

export const AuthController = {
  createUser,
};
