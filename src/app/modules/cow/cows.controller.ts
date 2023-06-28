import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { ICow } from './cows.interface';
import { CowService } from './cows.service';
import { ObjectId } from 'mongodb';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {

      const cow: ICow | null = await CowService.createCow(req.body);

      if (!cow) {
        sendResponse<ICow>(res, {
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to create cow',
          data: null,
        });
        return;
      }

      if (!ObjectId.isValid(cow.seller)) {
        sendResponse<ICow>(res, {
          statusCode: httpStatus.BAD_REQUEST,
          success: false,
          message: 'Invalid seller',
          data: null,
        });
        return;
      }

      cow.seller = `ObjectId(${cow.seller})`;

      sendResponse<ICow>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Cow created successfully',
        data: cow,
      });
    }
  
  
)

const getAllCows: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice,
        location,
        searchTerm,
      }: IPaginationOptions = req.query;

      const options = paginationHelpers.calculatePagination({
        page: Number(page),
        limit: Number(limit),
        sortBy,
        sortOrder,
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        location,
        searchTerm,
      });

      const cows = await CowService.getAllCows(options);

    
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Cows retrieved successfully',
        data: cows,
      });
    
    
  }
);

const getCowById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
   
      const { id } = req.params;
      const cow = await CowService.getCowById(id);
      if (cow) {
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Cow retrieved successfully',
          data: cow,
        });
      } else {
        sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: 'Cow not found',
          data: null,
        });
      }
    } 
);

const updateCowById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    
      const { id } = req.params;
      const cow = await CowService.updateCowById(id, req.body);
      if (cow) {
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Cow updated successfully',
          data: cow,
        })     
      }
    }
  
)

const deleteCowById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
   
      const { id } = req.params;
      const cow = await CowService.deleteCowById(id);
      if (cow) {
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Cow deleted successfully',
          data: cow,
        });
      } 
  }
)

export const CowController = {
  createCow,
  getAllCows,
  getCowById,
  updateCowById,
  deleteCowById,
};
