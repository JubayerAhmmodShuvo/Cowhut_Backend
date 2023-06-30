import { Schema, model } from 'mongoose';
import { UserRole } from '../../../enum/user';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { AdminModel, IAdmin } from './admin.interface';

const adminSchema = new Schema<IAdmin, AdminModel>(
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

adminSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<Pick<IAdmin, '_id' | 'phoneNumber' | 'password' | 'role'> | null> {
  return await Admin.findOne(
    { phoneNumber },
    { phoneNumber: 1, password: 1, role: 1 }
  );
};

adminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

adminSchema.pre('save', async function (next) {
  const admin = this;
  admin.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);

export default Admin;
