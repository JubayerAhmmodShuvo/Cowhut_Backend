import { Schema, model } from 'mongoose';
import { UserRole } from '../../../enum/user';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { IAdmin } from './admin.interface';

const adminSchema = new Schema<IAdmin>(
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

adminSchema.pre('save', async function (next) {
  const admin = this;
  admin.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

const Admin = model<IAdmin>('Admin', adminSchema);

export default Admin;
