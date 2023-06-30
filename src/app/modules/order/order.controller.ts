import { Request, RequestHandler, Response } from 'express';
import { createOrder, getOrderById, getOrders } from './order.service';
import { ObjectId } from 'mongodb';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import IOrder from './order.interface';

const createOrderController: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
   
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
    } 
);

const getOrdersController: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
  
      const orders = await getOrders();

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
      });
    }
)

const getOrderByIdController = async (req: Request, res: Response) => {
  
    const orderId = req.params.id;
    const order = await getOrderById(orderId);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Order retrieved successfully',
      data: order,
    });
  } 



export const OrderController = {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
};
