import { Schema, model } from 'mongoose';
import { IUser } from './users.interface';
import { UserRole } from '../../../enum/user';
import bcrypt from 'bcrypt';
import config from '../../../config';

const userSchema = new Schema<IUser>(
  {
    phoneNumber: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
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
      transform: function (doc, ret) {
        delete ret.password; 
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

const User = model<IUser>('User', userSchema);

export default User;
