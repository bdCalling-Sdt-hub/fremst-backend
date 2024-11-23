import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { OldInspectionService } from './oldInspection.service';

const createOldInspection = catchAsync(async (req: Request, res: Response) => {
  let pdfReport = null;
  if (req.files && 'pdfReport' in req.files && req.files.pdfReport[0]) {
    pdfReport = `/pdfReports/${req.files.pdfReport[0].filename}`;
  }
  const data = {
    ...req.body,
    pdfReport,
  };
  const result = await OldInspectionService.createOldInspection(data);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'OldInspection created successfully',
    data: result,
  });
});

const getAllOldInspections = catchAsync(async (req: Request, res: Response) => {
  const search: any = req.query.search || '';
  const page = req.query.page || null;
  const limit = req.query.limit || null;

  const result = await OldInspectionService.getAllOldInspections(
    search as string,
    page as number | null,
    limit as number | null
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'OldInspections fetched successfully',
    data: result,
  });
});

const getOldInspectionById = catchAsync(async (req: Request, res: Response) => {
  const result = await OldInspectionService.getOldInspectionById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'OldInspection fetched successfully',
    data: result,
  });
});

const updateOldInspection = catchAsync(async (req: Request, res: Response) => {
  const result = await OldInspectionService.updateOldInspection(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'OldInspection updated successfully',
    data: result,
  });
});

const deleteOldInspection = catchAsync(async (req: Request, res: Response) => {
  const result = await OldInspectionService.deleteOldInspection(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'OldInspection deleted successfully',
    data: result,
  });
});
const getOldInspectionByProductAndCustomer = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.query.product || !req.query.customer) {
      throw new Error('product and customer is required');
    }
    const result =
      await OldInspectionService.getOldInspectionByProductAndCustomer(
        req.query.product as string,
        req.query.customer as string
      );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'OldInspection fetched successfully',
      data: result,
    });
  }
);
const downloadFile = catchAsync(async (req: Request, res: Response) => {
  const result = await OldInspectionService.downloadFile(req.params.id, res);
  // sendResponse(res, {
  //   statusCode: StatusCodes.OK,
  //   success: true,
  //   message: 'File downloaded successfully',
  //   data: result,
  // });
});
export const OldInspectionController = {
  createOldInspection,
  getAllOldInspections,
  getOldInspectionById,
  updateOldInspection,
  deleteOldInspection,
  getOldInspectionByProductAndCustomer,
  downloadFile,
};
