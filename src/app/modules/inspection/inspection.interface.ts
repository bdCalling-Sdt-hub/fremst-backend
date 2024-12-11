import { Model, Types } from 'mongoose';

export type IInspection = {
  sku: string;
  product: Types.ObjectId;
  customer: Types.ObjectId;
  enStandard: string;
  serialNo: string;
  step: [
    {
      name: string;
      answers: [
        {
          question: string;
          comment: string;
          isYes: boolean;
        }
      ];
    }
  ];
  summery: string;
  protocolId?: string;
  isApproved: boolean;
  isActive: boolean;
  productImage: string;
  pdfReport: string;
  lastInspectionDate: string;
  nextInspectionDate: Date;
};

export type InspectionModel = Model<IInspection>;
