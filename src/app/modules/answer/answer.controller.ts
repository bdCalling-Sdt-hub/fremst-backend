import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AnswerService } from './answer.service';

const createAnswer = catchAsync(async (req: Request, res: Response) => {
  const result = await AnswerService.createAnswer(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Answer created successfully',
    data: result,
  });
});

const getAllAnswers = catchAsync(async (req: Request, res: Response) => {
  const search: any = req.query.search || '';
  const page = req.query.page || null;
  const limit = req.query.limit || null;

  const result = await AnswerService.getAllAnswers(search as string, page as number | null, limit as number | null);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Answers fetched successfully',
    data: result,
  });
});

const getAnswerById = catchAsync(async (req: Request, res: Response) => {
  const result = await AnswerService.getAnswerById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Answer fetched successfully',
    data: result,
  });
});

const updateAnswer = catchAsync(async (req: Request, res: Response) => {
  const result = await AnswerService.updateAnswer(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Answer updated successfully',
    data: result,
  });
});

const deleteAnswer = catchAsync(async (req: Request, res: Response) => {
  const result = await AnswerService.deleteAnswer(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Answer deleted successfully',
    data: result,
  });
});

export const AnswerController = {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
};
