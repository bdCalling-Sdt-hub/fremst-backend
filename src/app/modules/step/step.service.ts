import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Step } from './step.model';
import { IStep } from './step.interface';
import { StepValidation } from './step.validation';
import unlinkFile from '../../../shared/unlinkFile';

const createStep = async (payload: IStep): Promise<IStep> => {
  await StepValidation.createStepZodSchema.parseAsync(payload);
  const result = await Step.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create step!');
  }
  return result;
};

const getAllSteps = async (
  search: string,
  page: number | null,
  limit: number | null,
  productID: string
): Promise<IStep[]> => {
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { product: { $regex: search, $options: 'i' } },
        ],
        product: productID,
      }
    : { product: productID };
  let queryBuilder = Step.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }

  return await queryBuilder;
};

const getStepById = async (id: string): Promise<IStep | null> => {
  const result = await Step.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Step not found!');
  }
  return result;
};

const updateStep = async (
  id: string,
  payload: IStep
): Promise<IStep | null> => {
  await StepValidation.updateStepZodSchema.parseAsync(payload);
  if (payload.stepImage && payload.stepImage !== '/stepImage/default.png') {
    await unlinkFile(payload.stepImage);
  }
  const result = await Step.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update step!');
  }
  return result;
};

const deleteStep = async (id: string): Promise<IStep | null> => {
  const isExist = await Step.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Step not found!');
  }
  if (isExist.stepImage) {
    await unlinkFile(isExist.stepImage);
  }
  const result = await Step.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete step!');
  }
  return result;
};

export const StepService = {
  createStep,
  getAllSteps,
  getStepById,
  updateStep,
  deleteStep,
};
