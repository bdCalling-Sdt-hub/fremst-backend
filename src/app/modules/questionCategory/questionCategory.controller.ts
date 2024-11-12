import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { QuestionCategoryService } from './questionCategory.service';

const createQuestionCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionCategoryService.createQuestionCategory(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'QuestionCategory created successfully',
    data: result,
  });
});

const getAllQuestionCategorys = catchAsync(async (req: Request, res: Response) => {
  const search: any = req.query.search || '';
  const page = req.query.page || null;
  const limit = req.query.limit || null;

  const result = await QuestionCategoryService.getAllQuestionCategorys(search as string, page as number | null, limit as number | null);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'QuestionCategorys fetched successfully',
    data: result,
  });
});

const getQuestionCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionCategoryService.getQuestionCategoryById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'QuestionCategory fetched successfully',
    data: result,
  });
});

const updateQuestionCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionCategoryService.updateQuestionCategory(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'QuestionCategory updated successfully',
    data: result,
  });
});

const deleteQuestionCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionCategoryService.deleteQuestionCategory(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'QuestionCategory deleted successfully',
    data: result,
  });
});

export const QuestionCategoryController = {
  createQuestionCategory,
  getAllQuestionCategorys,
  getQuestionCategoryById,
  updateQuestionCategory,
  deleteQuestionCategory,
};
