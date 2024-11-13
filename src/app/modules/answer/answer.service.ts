import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Answer } from './answer.model';
import { IAnswer } from './answer.interface';

const createAnswer = async (payload: IAnswer): Promise<IAnswer> => {
  const result = await Answer.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create answer!');
  }
  return result;
};

const getAllAnswers = async (search: string, page: number | null, limit: number | null): Promise<IAnswer[]> => {
  const query = search ? { $or: [{ question: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } },
        { isYes: { $regex: search, $options: 'i' } }] } : {};
  let queryBuilder = Answer.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }

  return await queryBuilder;
};


const getAnswerById = async (id: string): Promise<IAnswer | null> => {
  const result = await Answer.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Answer not found!');
  }
  return result;
};

const updateAnswer = async (id: string, payload: IAnswer): Promise<IAnswer | null> => {
  const result = await Answer.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update answer!');
  }
  return result;
};

const deleteAnswer = async (id: string): Promise<IAnswer | null> => {
  const result = await Answer.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete answer!');
  }
  return result;
};

export const AnswerService = {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
};
