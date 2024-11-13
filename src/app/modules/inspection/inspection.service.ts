import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Inspection } from './inspection.model';
import { IInspection } from './inspection.interface';

const createInspection = async (payload: IInspection): Promise<IInspection> => {
  const result = await Inspection.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create inspection!');
  }
  return result;
};

const getAllInspections = async (
  search: string,
  page: number | null,
  limit: number | null
): Promise<IInspection[]> => {
  const query = search
    ? {
        $or: [
          { product: { $regex: search, $options: 'i' } },
          { customer: { $regex: search, $options: 'i' } },
          { steps: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  let queryBuilder = Inspection.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }

  return await queryBuilder;
};

const getInspectionById = async (id: string): Promise<IInspection | null> => {
  const result = await Inspection.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Inspection not found!');
  }
  return result;
};

const updateInspection = async (
  id: string,
  payload: IInspection
): Promise<IInspection | null> => {
  const isExistInspection = await getInspectionById(id);
  if (!isExistInspection) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Inspection not found!');
  }
  const result = await Inspection.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update inspection!');
  }
  return result;
};

const deleteInspection = async (id: string): Promise<IInspection | null> => {
  const isExistInspection = await getInspectionById(id);
  if (!isExistInspection) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Inspection not found!');
  }
  const result = await Inspection.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete inspection!');
  }
  return result;
};

export const InspectionService = {
  createInspection,
  getAllInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
};
