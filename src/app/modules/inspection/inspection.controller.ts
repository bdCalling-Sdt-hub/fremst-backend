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
    const image = `/inspectionImages/${req.files.inspectionImage[0].filename}`;
    finalData = {
      productImage: image as string,
      ...data,
    };
  } else {
    throw new Error('inspectionImage is required');
  }
  if (req.files && 'pdfReport' in req.files && req.files.pdfReport[0]) {
    const pdfReport = `/pdfReports/${req.files.pdfReport[0].filename}`;
    finalData = {
      ...finalData,
      pdfReport,
    };
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
  const query = req.query;
  const result = await InspectionService.getAllInspections(query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    pagination: {
      //@ts-ignore
      page: query.page || 1,
      //@ts-ignore
      limit: query.limit || 10,
      //@ts-ignore
      totalPage: Math.ceil((result.total || 0) / (query.limit || 20)),
      //@ts-ignore
      total: result.total || 0,
    },
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
const getFullInspectionInfo = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InspectionService.getFullInspectionInfo(req.params.id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Inspection fetched successfully',
      data: result,
    });
  }
);
export const InspectionController = {
  createInspection,
  getAllInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
  getFullInspectionInfo,
};
