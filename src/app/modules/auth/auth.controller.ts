import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { UserService } from '../user/users.service';
import { IUser } from '../user/users.interface';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { ILoginUserResponse } from './auth.interface';
import config from '../../../config';
import { AuthService } from './auth.service';

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

    const newUser = await AuthService.createUser(userData);

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
const loginUser = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  // const { ...loginData } = req.body;
  // const result = await AuthService.loginUser(loginData);
  // const { refreshToken, ...others } = result;

  // // set refresh token into cookie

  // const cookieOptions = {
  //   secure: config.env === 'production',
  //   httpOnly: true,
  // };

  // res.cookie('refreshToken', refreshToken, cookieOptions);

  // sendResponse<ILoginUserResponse>(res, {
  //   statusCode: 200,
  //   success: true,
  //   message: 'User lohggedin successfully !',
  //   data: others,
  // });
});

export const AuthController = {
  createUser,
  loginUser,
};
