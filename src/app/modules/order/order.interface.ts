import { ObjectId } from 'mongodb';

type IOrder = {
  cow: ObjectId;
  buyer: ObjectId;
};

export default IOrder;
