import { Schema, model } from 'mongoose';
import { IInspection, InspectionModel } from './inspection.interface';

const inspectionSchema = new Schema<IInspection, InspectionModel>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
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
    sku: {
      type: String,
      required: true,
    },

    enStandard: {
      type: String,
      required: true,
    },
    serialNo: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    summery: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      required: true,
      default: false,
    },
    inspectionDate: {
      type: String,
      required: true,
    },
    nextInspectionDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Inspection = model<IInspection, InspectionModel>(
  'Inspection',
  inspectionSchema
);
