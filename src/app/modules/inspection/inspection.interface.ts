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
};

export type InspectionModel = Model<IInspection>;
