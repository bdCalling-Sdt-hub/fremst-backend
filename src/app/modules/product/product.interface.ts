import { Model, Types } from 'mongoose';

export type IProduct = {
  sku: string;
  name: string;
  brand: string;
  image: string;
  type: string;
  serialNo: string;
  enStandard: string;
  inspectionInterval: string;
  latestInspectionDate: string;
  isActive: boolean;
  inspectionHistory?: Array<string>;
  companyName: string;
  contactPerson: string;
};

export type ProductModel = Model<IProduct>;
