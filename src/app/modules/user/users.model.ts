import { Schema, model } from 'mongoose';
import { IUser } from './users.interface';
import { UserRole } from '../../../enum/user';

const userSchema = new Schema<IUser>(
  {
    phoneNumber: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
    },
    password: String,
    name: {
      firstName: String,
      lastName: String,
    },
    address: String,
    budget: Number,
    income: Number,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const User = model<IUser>('User', userSchema);

export default User;
