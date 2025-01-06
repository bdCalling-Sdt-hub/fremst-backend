import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Employee } from './employee.model';
import { IEmployee } from './employee.interface';

const createEmployee = async (payload: IEmployee): Promise<IEmployee> => {
  const isExistEmployee = await Employee.findOne({ name: payload.name });
  if (isExistEmployee) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Employee already exist!');
  }
  const result = await Employee.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create employee!');
  }
  return result;
};

const getAllEmployees = async (
  queryFields: Record<string, any>
): Promise<IEmployee[]> => {
  const { search, page, limit } = queryFields;
  const query = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }] }
    : {};
  let queryBuilder = Employee.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }
  delete queryFields.search;
  delete queryFields.page;
  delete queryFields.limit;
  queryBuilder.find(queryFields);
  return await queryBuilder;
};

const getEmployeeById = async (id: string): Promise<IEmployee | null> => {
  const result = await Employee.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Employee not found!');
  }
  return result;
};

const updateEmployee = async (
  id: string,
  payload: IEmployee
): Promise<IEmployee | null> => {
  const isExistEmployee = await getEmployeeById(id);
  if (!isExistEmployee) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Employee not found!');
  }

  const result = await Employee.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update employee!');
  }
  return result;
};

const deleteEmployee = async (id: string): Promise<IEmployee | null> => {
  const isExistEmployee = await getEmployeeById(id);
  if (!isExistEmployee) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Employee not found!');
  }

  const result = await Employee.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete employee!');
  }
  return result;
};

export const EmployeeService = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
