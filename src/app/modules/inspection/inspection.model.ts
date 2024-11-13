import { Schema, model } from 'mongoose';
import { IInspection, InspectionModel } from './inspection.interface';

const inspectionSchema = new Schema<IInspection, InspectionModel>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    steps: [{ type: Schema.Types.ObjectId, ref: 'Step' }],
  },
  { timestamps: true }
);

export const Inspection = model<IInspection, InspectionModel>(
  'Inspection',
  inspectionSchema
);
