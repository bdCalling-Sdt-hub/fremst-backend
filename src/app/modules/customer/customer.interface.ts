import { Model, Types } from 'mongoose';

export type ICustomer = {
  companyName: string;
  companyPhone: number;
  contactPerson: string;
  email: string;
  phone: number;
  address: string;
};

export type CustomerModel = Model<ICustomer>;
