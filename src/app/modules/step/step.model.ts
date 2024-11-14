import { Schema, model } from 'mongoose';
import { IStep, StepModel } from './step.interface';

const stepSchema = new Schema<IStep, StepModel>(
  {
    name: { type: String, required: true },
    stepImage: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

export const Step = model<IStep, StepModel>('Step', stepSchema);
