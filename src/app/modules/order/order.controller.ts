import { Request, RequestHandler, Response } from 'express';
import { createOrder, getOrders } from './order.service';
import { ObjectId } from 'mongodb';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import IOrder from './order.interface';

const createOrderController: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { cow, buyer } = req.body;

      const createdOrder = await createOrder({
        cow: new ObjectId(cow),
        buyer: new ObjectId(buyer),
      });

      sendResponse<IOrder>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Order created successfully',
        data: createdOrder,
      });
    } catch (error) {
      
      sendResponse<IOrder>(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create order',
        data: null,
      });
    }
  }
);

const getOrdersController: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const orders = await getOrders();

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to fetch orders',
        data: null,
      });
    }
  }
);

export const OrderController = {
  createOrderController,
  getOrdersController,
};
