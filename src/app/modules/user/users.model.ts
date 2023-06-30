import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './users.interface';
import { UserRole } from '../../../enum/user';
import bcrypt from 'bcrypt';
import config from '../../../config';

const userSchema = new Schema<IUser, UserModel>(
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

userSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<Pick<IUser, '_id' | 'phoneNumber' | 'password' | 'role'> | null> {
  return await User.findOne(
    { phoneNumber },
    { _id: 1, phoneNumber: 1, password: 1, role: 1 }
  );
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

const User = model<IUser, UserModel>('User', userSchema);

export default User;
