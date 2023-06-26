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
  const cowData = await CowModel.findById(cow);

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

    return createdOrder;
  } catch (error)
  {
    await session.abortTransaction();
    session.endSession();
    throw new Error('Failed to create order');
    
  }
};

const getOrders = async () => {
  const orders = await OrderModel.find();
  return orders;
};

export { createOrder, getOrders };
