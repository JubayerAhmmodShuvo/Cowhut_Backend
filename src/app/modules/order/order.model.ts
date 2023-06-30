import mongoose, { Schema, model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

type IOrderModel = {
  cow: ObjectId;
  buyer: ObjectId;
} & Document;

const orderSchema = new Schema(
  {
    cow: { type: Schema.Types.ObjectId, ref: 'Cow', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
);

const OrderModel = model<IOrderModel>('Order', orderSchema);

export default OrderModel;
