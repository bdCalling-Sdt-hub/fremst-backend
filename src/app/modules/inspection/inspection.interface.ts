import { Model, Types } from 'mongoose';

export type IInspection = {
  product: Types.ObjectId;
  customer: Types.ObjectId;
  steps: [Types.ObjectId];
};

export type InspectionModel = Model<IInspection>;
