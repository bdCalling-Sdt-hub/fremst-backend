import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { OldInspection } from './oldInspection.model';
import { IOldInspection } from './oldInspection.interface';
import { OldInspectionValidation } from './oldInspection.validation';
import unlinkFile from '../../../shared/unlinkFile';

const createOldInspection = async (
  payload: IOldInspection
): Promise<IOldInspection> => {
  await OldInspectionValidation.createOldInspectionZodSchema.parseAsync(
    payload
  );
  const result = await OldInspection.create(payload);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create oldInspection!'
    );
  }
  return result;
};

const getAllOldInspections = async (
  search: string,
  page: number | null,
  limit: number | null
): Promise<IOldInspection[]> => {
  const query = search
    ? {
        $or: [
          { customer: { $regex: search, $options: 'i' } },
          { product: { $regex: search, $options: 'i' } },
          { inspectionDate: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  let queryBuilder = OldInspection.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }

  return await queryBuilder;
};
const getOldInspectionByProductAndCustomer = async (
  product: string,
  customer: string
): Promise<IOldInspection[] | null> => {
  const result = await OldInspection.find({ product, customer });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'OldInspection not found!');
  }
  return result;
};

const getOldInspectionById = async (
  id: string
): Promise<IOldInspection | null> => {
  const result = await OldInspection.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'OldInspection not found!');
  }
  return result;
};

const updateOldInspection = async (
  id: string,
  payload: IOldInspection
): Promise<IOldInspection | null> => {
  await OldInspectionValidation.updateOldInspectionZodSchema.parseAsync(
    payload
  );

  const isExistOldInspection = await getOldInspectionById(id);
  if (!isExistOldInspection) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'OldInspection not found!');
  }
  if (payload.pdfReport) {
    await unlinkFile(payload.pdfReport);
  }
  const result = await OldInspection.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to update oldInspection!'
    );
  }
  return result;
};

const deleteOldInspection = async (
  id: string
): Promise<IOldInspection | null> => {
  const isExistOldInspection = await getOldInspectionById(id);
  if (!isExistOldInspection) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'OldInspection not found!');
  }
  const result = await OldInspection.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to delete oldInspection!'
    );
  }
  return result;
};

export const OldInspectionService = {
  createOldInspection,
  getAllOldInspections,
  getOldInspectionById,
  updateOldInspection,
  deleteOldInspection,
  getOldInspectionByProductAndCustomer,
};
