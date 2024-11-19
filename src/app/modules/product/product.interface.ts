import { Model, Types } from 'mongoose';

export type IProduct = {
  name: string;
  brand: string;
  image: string;
  type: string;
  inspectionInterval: string;
  latestInspectionDate?: string;
  nextInspectionDate: string;
  isActive: boolean;
  inspectionHistory?: Array<string>;
  companyName: string;
  contactPerson: string;
  question: Array<Types.ObjectId>;
};

export type ProductModel = Model<IProduct>;
