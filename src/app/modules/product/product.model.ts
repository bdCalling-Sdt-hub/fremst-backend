import { Schema, model } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';

const productSchema = new Schema<IProduct, ProductModel>(
  {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },

    inspectionInterval: {
      type: String,
      required: true,
    },
    latestInspectionDate: {
      type: String,
      required: false,
    },
    nextInspectionDate: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    inspectionHistory: {
      type: [String],
      required: false,
    },
    companyName: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    question: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre('save', async function (next) {
  next();
});

export const Product = model<IProduct, ProductModel>('Product', productSchema);
