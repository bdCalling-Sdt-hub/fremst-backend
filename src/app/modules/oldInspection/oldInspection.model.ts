import { Schema, model } from 'mongoose';
import { IOldInspection, OldInspectionModel } from './oldInspection.interface';
import { Customer } from '../customer/customer.model';
import { Product } from '../product/product.model';

const oldInspectionSchema = new Schema<IOldInspection, OldInspectionModel>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    lastInspectionDate: { type: String, required: true },
    pdfReport: { type: String, required: true },
  },
  { timestamps: true }
);
oldInspectionSchema.pre('save', async function (next) {
  const isExistCustomer = await Customer.findOne({
    _id: this.customer,
  });
  if (!isExistCustomer) {
    throw new Error('Customer not found!');
  }
  const isExistProduct = await Product.findOne({
    _id: this.product,
  });
  if (!isExistProduct) {
    throw new Error('Product not found!');
  }
  next();
});
export const OldInspection = model<IOldInspection, OldInspectionModel>(
  'OldInspection',
  oldInspectionSchema
);
