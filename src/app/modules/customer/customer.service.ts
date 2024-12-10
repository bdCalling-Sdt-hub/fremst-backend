import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Customer } from './customer.model';
import { ICustomer } from './customer.interface';
import { Inspection } from '../inspection/inspection.model';

const createCustomer = async (payload: ICustomer): Promise<ICustomer> => {
  const result = await Customer.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create customer!');
  }
  return result;
};

const getAllCustomers = async (
  search: string,
  page: number,
  limit: number
): Promise<ICustomer[]> => {
  try {
    const skip = (page - 1) * limit;
    const query = search
      ? {
          $or: [
            { companyName: { $regex: new RegExp(search, 'i') } },
            { companyPhone: { $regex: new RegExp(search, 'i') } },
            { contactPerson: { $regex: new RegExp(search, 'i') } },
            { email: { $regex: new RegExp(search, 'i') } },
            { address: { $regex: new RegExp(search, 'i') } },
          ],
        }
      : {};

    return await Customer.find(query).lean().skip(skip).limit(limit).exec();
  } catch (error) {
    throw new Error(`Error fetching customers: ${error}`);
  }
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
  const deleteInspection = await Inspection.deleteMany({
    customer: id,
  });
  if (!deleteInspection) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete customer!');
  }
  return result;
};
const getAllCustomersLean = async (): Promise<ICustomer[]> => {
  try {
    return await Customer.find().select('_id contactPerson').lean().exec();
  } catch (error) {
    throw new Error(`Error fetching customers: ${error}`);
  }
};
export const CustomerService = {
  createCustomer,
  getAllCustomers,
  getAllCustomersLean,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
