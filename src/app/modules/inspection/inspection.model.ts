import { Schema, model } from 'mongoose';
import { IInspection, InspectionModel } from './inspection.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { Product } from '../product/product.model';
import { Customer } from '../customer/customer.model';

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
inspectionSchema.pre('save', async function (next) {
  const isExistProduct = await Product.findOne({ _id: this.product });
  if (!isExistProduct) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not found!');
  }
  const isExistCustomer = await Customer.findOne({ _id: this.customer });
  if (!isExistCustomer) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Customer not found!');
  }
  next();
});

export const Inspection = model<IInspection, InspectionModel>(
  'Inspection',
  inspectionSchema
);
