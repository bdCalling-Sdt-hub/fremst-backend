import { Model, Types } from 'mongoose';

export type IProduct = {
  sku: string;
  name: string;
  brand: string;
  type: string;
  serialNo: string;
  enStandard: string;
  inspectionInterval: number;
  latestInspectionDate: Date;
  isActive: boolean;
  inspectionHistory: Array<string>;
  companyName: string;
  contactPerson: string;
};

export type ProductModel = Model<IProduct>;
