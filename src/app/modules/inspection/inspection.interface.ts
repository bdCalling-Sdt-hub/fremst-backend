import { Model, Types } from 'mongoose';

export type IInspection = {
  sku: string;
  product: Types.ObjectId;
  customer: Types.ObjectId;
  enStandard: string;
  serialNo: string;
  brand: string;
  companyName: string;
  username: string;
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
  storageLocation?: string;
  productImage: string;
  lastInspectionDate: string;
  nextInspectionDate: Date;
};

export type InspectionModel = Model<IInspection>;
