import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { CustomerService } from './customer.service';

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerService.createCustomer(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Customer created successfully',
    data: result,
  });
});

const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const search: any = req.query.search || '';
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;

  const result = await CustomerService.getAllCustomers(
    search as string,
    page as number,
    limit as number
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customers fetched successfully',
    data: result,
  });
});

const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerService.getCustomerById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer fetched successfully',
    data: result,
  });
});

const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerService.updateCustomer(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer updated successfully',
    data: result,
  });
});

const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerService.deleteCustomer(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer deleted successfully',
    data: result,
  });
});

export const CustomerController = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
