import { Schema, model } from 'mongoose';
import { IInspection, InspectionModel } from './inspection.interface';

const inspectionSchema = new Schema<IInspection, InspectionModel>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    step: [
      {
        name: { type: String, required: true },
        answers: [
          {
            question: { type: String, required: true },
            comment: { type: String, required: false },
            isYes: { type: Boolean, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Inspection = model<IInspection, InspectionModel>(
  'Inspection',
  inspectionSchema
);
