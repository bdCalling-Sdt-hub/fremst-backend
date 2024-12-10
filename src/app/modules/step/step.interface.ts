import { Model, Types } from 'mongoose';

export type IStep = {
  _id?: Types.ObjectId;
  name: string;
  product: Types.ObjectId;
  stepImage: string;
};

export type StepModel = Model<IStep>;
