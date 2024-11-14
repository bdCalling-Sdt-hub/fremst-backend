import { Model, Types } from 'mongoose';

export type IStep = {
  name: string;
  product: Types.ObjectId;
  stepImage: string;
};

export type StepModel = Model<IStep>;
