import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { UserService } from '../user/users.service';
import { IUser } from '../user/users.interface';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';
import { AuthService } from './auth.service';

const createUser = catchAsync(
   async (req: Request, res: Response) => {
 
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
      toObject: undefined
    };

    const newUser = await AuthService.createUser(userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } 
  
)

const loginUser = catchAsync(async (req: Request, res: Response) => {
 

    const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully !',
    data: others
  });
  }
  
)

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);


  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User lohggedin successfully !',
    data: result,
  });
});

export const AuthController = {
  createUser,
  loginUser,
  refreshToken
};
