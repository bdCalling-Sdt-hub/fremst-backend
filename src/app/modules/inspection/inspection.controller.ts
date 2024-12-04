import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { InspectionService } from './inspection.service';
import { IInspection } from './inspection.interface';

const createInspection = catchAsync(async (req: Request, res: Response) => {
  let finalData: any;
  const data = await JSON.parse(req.body.data);
  if (
    req.files &&
    'inspectionImage' in req.files &&
    req.files.inspectionImage[0]
  ) {
    const image = `/images/${req.files.inspectionImage[0].filename}`;
    finalData = {
      productImage: image as string,
      ...data,
    };
  } else {
    throw new Error('inspectionImage is required');
  }

  const result = await InspectionService.createInspection(
    finalData as IInspection
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Inspection created successfully',
    data: result,
  });
});

const getAllInspections = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page || null;
  delete req.query.page;
  const limit = req.query.limit || null;
  delete req.query.limit;
  const query = req.query;
  const result = await InspectionService.getAllInspections(
    page as number | null,
    limit as number | null,
    query
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Inspections fetched successfully',
    data: result,
  });
});

const getInspectionById = catchAsync(async (req: Request, res: Response) => {
  const result = await InspectionService.getInspectionById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Inspection fetched successfully',
    data: result,
  });
});

const updateInspection = catchAsync(async (req: Request, res: Response) => {
  const result = await InspectionService.updateInspection(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Inspection updated successfully',
    data: result,
  });
});

const deleteInspection = catchAsync(async (req: Request, res: Response) => {
  const result = await InspectionService.deleteInspection(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Inspection deleted successfully',
    data: result,
  });
});

export const InspectionController = {
  createInspection,
  getAllInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
};
