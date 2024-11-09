import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Customer } from './customer.model';
import { ICustomer } from './customer.interface';

const createCustomer = async (payload: ICustomer): Promise<ICustomer> => {
  const result = await Customer.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create customer!');
  }
  return result;
};

const getAllCustomers = async (search: string): Promise<ICustomer[]> => {
  let result: any;
  if (search !== '') {
    result = await Customer.find({
      $or: [
        { companyName: { $regex: search, $options: 'i' } },
        { companyPhone: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ],
    });
    return result;
  } else {
    result = await Customer.find();
  }
  return result;
};

const getCustomerById = async (id: string): Promise<ICustomer | null> => {
  const result = await Customer.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Customer not found!');
  }
  return result;
};

const updateCustomer = async (
  id: string,
  payload: ICustomer
): Promise<ICustomer | null> => {
  const result = await Customer.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update customer!');
  }
  return result;
};

const deleteCustomer = async (id: string): Promise<ICustomer | null> => {
  const result = await Customer.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete customer!');
  }
  return result;
};

export const CustomerService = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
