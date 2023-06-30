import { ObjectId } from 'mongodb';
import OrderModel from './order.model';
import User from '../user/users.model';
import CowModel from '../cow/cows.model';

type ICreateOrderParams = {
  cow: ObjectId;
  buyer: ObjectId;
};

const createOrder = async ({ cow, buyer }: ICreateOrderParams) => {
  const buyerData = await User.findById(buyer);
const cowData = await CowModel.findById(cow).populate('seller', '-__v');

  if (!buyerData) {
    throw new Error('Buyer not found');
  }

  if (!cowData) {
    throw new Error('Cow not found');
  }

  if (buyerData.budget < cowData.price) {
    throw new Error('Insufficient funds');
  }

  const session = await OrderModel.startSession();
  session.startTransaction();

  try {
    const cowId = new ObjectId(cow);
    const buyerId = new ObjectId(buyer);

    await CowModel.findByIdAndUpdate(cow, { status: 'sold out' });
    await User.findByIdAndUpdate(buyer, {
      $inc: { budget: -cowData.price },
    });
    await User.findByIdAndUpdate(cowData.seller, {
      $inc: { income: cowData.price },
    });

    const createdOrder = await OrderModel.create({ cow, buyer });

    await session.commitTransaction();
    session.endSession();

    const populatedOrder = await OrderModel.findById(createdOrder._id)
      .populate({
        path: 'cow',
        select: '-__v',
        populate: {
          path: 'seller',
          select: '-__v',
        },
      })
      .populate({
        path: 'buyer',
        select: '-__v',
      })
      .exec();

    if (!populatedOrder) {
      throw new Error('Failed to retrieve order information');
    }

    return populatedOrder;
  } catch (error) {
    console.error('Failed to create order:', error);
    await session.abortTransaction();
    session.endSession();
    throw new Error('Failed to create order');
  }
};

const getOrders = async () => {
  const orders = await OrderModel.find();
  return orders;
};


const getOrderById = async (orderId: string) => {
  const populatedOrder = await OrderModel.findById(orderId)
    .populate({
      path: 'cow',
      select: '-__v',
      populate: {
        path: 'seller',
        select: '-__v',
      },
    })
    .populate({
      path: 'buyer',
      select: '-__v',
    })
    .exec();

  if (!populatedOrder) {
    throw new Error('Order not found');
  }

  return populatedOrder;
};


export { createOrder, getOrders, getOrderById };
