import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { QuestionCategory } from './questionCategory.model';
import { IQuestionCategory } from './questionCategory.interface';

const createQuestionCategory = async (payload: IQuestionCategory): Promise<IQuestionCategory> => {
  const result = await QuestionCategory.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create questionCategory!');
  }
  return result;
};

const getAllQuestionCategorys = async (search: string, page: number | null, limit: number | null): Promise<IQuestionCategory[]> => {
  const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } },
        { product: { $regex: search, $options: 'i' } }] } : {};
  let queryBuilder = QuestionCategory.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }

  return await queryBuilder;
};


const getQuestionCategoryById = async (id: string): Promise<IQuestionCategory | null> => {
  const result = await QuestionCategory.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'QuestionCategory not found!');
  }
  return result;
};

const updateQuestionCategory = async (id: string, payload: IQuestionCategory): Promise<IQuestionCategory | null> => {
  const result = await QuestionCategory.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update questionCategory!');
  }
  return result;
};

const deleteQuestionCategory = async (id: string): Promise<IQuestionCategory | null> => {
  const result = await QuestionCategory.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete questionCategory!');
  }
  return result;
};

export const QuestionCategoryService = {
  createQuestionCategory,
  getAllQuestionCategorys,
  getQuestionCategoryById,
  updateQuestionCategory,
  deleteQuestionCategory,
};
