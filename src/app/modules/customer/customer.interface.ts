import { Model } from 'mongoose';

export type ICustomer = {
  companyName: string;
  companyPhone: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
};

export type CustomerModel = Model<ICustomer>;
