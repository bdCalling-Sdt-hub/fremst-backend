import { Schema, model } from 'mongoose';
import { ICustomer, CustomerModel } from './customer.interface';

const customerSchema = new Schema<ICustomer, CustomerModel>(
  {
    companyName: { type: String, required: true },
    companyPhone: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);
customerSchema.pre('save', async function (next) {
  const isExist = await Customer.findOne({ email: this.email });
  if (isExist) {
    throw new Error('Email already exist!');
  }
  next();
});
export const Customer = model<ICustomer, CustomerModel>(
  'Customer',
  customerSchema
);
