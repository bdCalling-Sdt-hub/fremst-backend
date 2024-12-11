import { Model, Types } from 'mongoose';

export type IOldInspection = {
  customer: Types.ObjectId;
  product: Types.ObjectId;
  lastInspectionDate: string;
  pdfReport: string;
  protocolId?: string;
};

export type OldInspectionModel = Model<IOldInspection>;
