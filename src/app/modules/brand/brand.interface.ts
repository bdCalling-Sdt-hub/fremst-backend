import { Model, Types } from 'mongoose';

export type IBrand = {
  name: string;
};

export type BrandModel = Model<IBrand>;
