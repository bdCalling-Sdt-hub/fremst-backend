import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { StepService } from './step.service';

const createStep = catchAsync(async (req: Request, res: Response) => {
  let stepImage = null;
  if (req.files && 'stepImage' in req.files && req.files.stepImage[0]) {
    stepImage = `/stepImage/${req.files.stepImage[0].filename}`;
  }
  const data = {
    ...req.body,
    stepImage,
  };
  const result = await StepService.createStep(data);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Step created successfully',
    data: result,
  });
});

const getAllStepsByProductID = catchAsync(
  async (req: Request, res: Response) => {
    const search: any = req.query.search || '';
    const page = req.query.page || null;
    const limit = req.query.limit || null;
    const productID = req.params.productID as string;
    const result = await StepService.getAllSteps(
      search as string,
      page as number | null,
      limit as number | null,
      productID as string
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Steps fetched successfully',
      data: result,
    });
  }
);

const getStepById = catchAsync(async (req: Request, res: Response) => {
  const result = await StepService.getStepById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Step fetched successfully',
    data: result,
  });
});

const updateStep = catchAsync(async (req: Request, res: Response) => {
  let stepImage = null;
  if (req.files && 'stepImage' in req.files && req.files.stepImage[0]) {
    stepImage = `/stepImage/${req.files.stepImage[0].filename}`;
  }
  const data = {
    ...req.body,
    stepImage,
  };
  const result = await StepService.updateStep(req.params.id, data);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Step updated successfully',
    data: result,
  });
});

const deleteStep = catchAsync(async (req: Request, res: Response) => {
  const result = await StepService.deleteStep(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Step deleted successfully',
    data: result,
  });
});

export const StepController = {
  createStep,
  getAllStepsByProductID,
  getStepById,
  updateStep,
  deleteStep,
};
