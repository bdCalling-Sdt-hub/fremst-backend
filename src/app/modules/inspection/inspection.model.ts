import { Schema, model } from 'mongoose';
import { IInspection, InspectionModel } from './inspection.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { Product } from '../product/product.model';
import { Customer } from '../customer/customer.model';
import { User } from '../user/user.model';

const inspectionSchema = new Schema<IInspection, InspectionModel>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
    brand: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    protocolId: {
      type: String,
      required: false,
      default: Math.floor(
        Math.random() * (999999 - 100000 + 1) + 100000
      ).toString(),
      unique: true,
    },
    lastInspectionDate: {
      type: String,
      required: true,
    },
    storageLocation: {
      type: String,
      required: false,
    },

    nextInspectionDate: {
      type: Date,
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
  const isExistCustomer = await User.findOne({ _id: this.customer });
  if (!isExistCustomer) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Customer not found!');
  }
  next();
});

export const Inspection = model<IInspection, InspectionModel>(
  'Inspection',
  inspectionSchema
);
