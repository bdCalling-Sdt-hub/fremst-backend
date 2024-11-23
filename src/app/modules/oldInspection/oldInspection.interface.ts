import { Model, Types } from 'mongoose';

export type IOldInspection = {
  customer: Types.ObjectId;
  product: Types.ObjectId;
  inspectionDate: string;
  pdfReport: string
};

export type OldInspectionModel = Model<IOldInspection>;
