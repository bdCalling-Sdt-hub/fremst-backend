import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { InspectionService } from './inspection.service';

const createInspection = catchAsync(async (req: Request, res: Response) => {
  const result = await InspectionService.createInspection(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Inspection created successfully',
    data: result,
  });
});

const getAllInspections = catchAsync(async (req: Request, res: Response) => {
  const search: any = req.query.search || '';
  const page = req.query.page || null;
  const limit = req.query.limit || null;

  const result = await InspectionService.getAllInspections(
    search as string,
    page as number | null,
    limit as number | null
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
