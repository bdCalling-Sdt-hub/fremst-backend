import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Customer } from './customer.model';
import { ICustomer } from './customer.interface';
import { Inspection } from '../inspection/inspection.model';
import { User } from '../user/user.model';
import { IUser } from '../user/user.interface';
import { USER_ROLES } from '../../../enums/user';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';

const createCustomer = async (payload: IUser): Promise<IUser> => {
  const result = await User.create({ ...payload, role: USER_ROLES.CUSTOMER });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create customer!');
  }
  await emailHelper.sendEmail(
    emailTemplate.addedAdminReminder({
      email: payload.email,
      name: payload.name,
      password: payload.password.toString(),
    })
  );
  return result;
};

const getAllCustomers = async (
  search: string,
  page: number,
  limit: number
): Promise<IUser[]> => {
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

    return await User.find({ ...query, role: USER_ROLES.CUSTOMER })
      .lean()
      .skip(skip)
      .limit(limit)
      .exec();
  } catch (error) {
    throw new Error(`Error fetching customers: ${error}`);
  }
};

const getCustomerById = async (id: string): Promise<any> => {
  const result = await User.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Customer not found!');
  }
  return result;
};

const updateCustomer = async (
  id: string,
  payload: IUser
): Promise<IUser | null> => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update customer!');
  }
  return result;
};

const deleteCustomer = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
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
const getAllCustomersLean = async (): Promise<IUser[]> => {
  try {
    return await User.find({ role: USER_ROLES.CUSTOMER })
      .select('_id name')
      .lean()
      .exec();
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
