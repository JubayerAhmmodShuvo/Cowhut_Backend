import { Model } from 'mongoose';
import { Breed, Category, Label } from '../../../enum/cows';

export type ICow = {
  name: string;
  age: number;
  price: number;
  location: Location;
  breed: Breed;
  weight: number;
  label: Label;
  category: Category;
  seller: string;
};

export type CowModel = Model<ICow, Record<string, unknown>>;
