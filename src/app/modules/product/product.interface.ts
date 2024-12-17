import { Model, Types } from 'mongoose';

export type IProduct = {
  name: string;
  image: string;
  type?: string;
};

export type ProductModel = Model<IProduct>;
