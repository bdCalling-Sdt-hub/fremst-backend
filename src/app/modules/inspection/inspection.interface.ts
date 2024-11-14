import { Model, Types } from 'mongoose';

export type IInspection = {
  product: Types.ObjectId;
  customer: Types.ObjectId;
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
