import { Model, Types } from 'mongoose';

export type IStep = {
  name: string;
  product: Types.ObjectId
};

export type StepModel = Model<IStep>;
