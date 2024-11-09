import { Schema, model } from 'mongoose';
import { ICustomer, CustomerModel } from './customer.interface';

const customerSchema = new Schema<ICustomer, CustomerModel>(
  {
    companyName: { type: String, required: true },
    companyPhone: { type: Number, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

export const Customer = model<ICustomer, CustomerModel>(
  'Customer',
  customerSchema
);
