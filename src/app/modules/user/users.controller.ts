import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './users.service';
import catchAsync from '../../../shared/catchAsync';
import { IUser } from './users.interface';



const getAllUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
  
    const users = await UserService.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  })
    
    
  


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
          }
          )
        }
      })
   
  

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
          })
        }
      }
    )
    
    
  


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
          })
        }
      })
      
    
  


export const UserController = {

  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
}
