/* eslint-disable no-undef */
import { Schema, model, Model } from 'mongoose';

import { Breed, Category, Label, Location } from '../../../enum/cows';
import { ICow } from './cows.interface';

const cowSchema = new Schema<ICow>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      enum: Object.values(Location),
      required: true,
    },
    breed: {
      type: String,
      enum: Object.values(Breed),
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      enum: Object.values(Label),
      default: Label.ForSale,
    },
    category: {
      type: String,
      enum: Object.values(Category),
      required: true,
    },
    seller: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const CowModel: Model<ICow> = model<ICow>('Cow', cowSchema);

export default CowModel;
