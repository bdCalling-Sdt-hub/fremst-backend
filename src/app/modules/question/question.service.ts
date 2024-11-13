import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Question } from './question.model';
import { IQuestion } from './question.interface';
import { Product } from '../product/product.model';
import { Step } from '../step/step.model';

const createQuestion = async (payload: IQuestion): Promise<IQuestion> => {
  const isExistProduct = await Product.findOne({ _id: payload.product });
  if (!isExistProduct) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not found!');
  }
  const result = await Question.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create question!');
  }
  await Product.findOneAndUpdate(
    { _id: payload.product },
    { $push: { questions: result._id } },
    { new: true }
  );
  return result;
};

const getAllQuestions = async (
  productID?: string,
  stepName?: string
): Promise<IQuestion[]> => {
  const isExistStep = await Step.findOne({
    product: productID,
    name: stepName,
  });
  if (!isExistStep) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Step not found!');
  }
  const allQuestions = await Question.find({ stepID: isExistStep._id });

  return allQuestions;
};

const getQuestionById = async (id: string): Promise<IQuestion | null> => {
  const result = await Question.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Question not found!');
  }
  return result;
};

const updateQuestion = async (
  id: string,
  payload: IQuestion
): Promise<IQuestion | null> => {
  const result = await Question.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update question!');
  }
  return result;
};

const deleteQuestion = async (id: string): Promise<IQuestion | null> => {
  const isExistProduct = await Question.findOne({ _id: id });

  const result = await Question.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete question!');
  }
  if (isExistProduct) {
    await Product.findOneAndUpdate(
      { questions: id },
      { $pull: { questions: id } },
      { new: true }
    );
  }
  return result;
};

export const QuestionService = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
