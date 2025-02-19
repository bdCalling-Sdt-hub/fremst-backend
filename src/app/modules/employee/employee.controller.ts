import { Request, Response } from 'express';
    import catchAsync from '../../../shared/catchAsync';
    import sendResponse from '../../../shared/sendResponse';
    import { StatusCodes } from 'http-status-codes';
    import { EmployeeService } from './employee.service';

    const createEmployee = catchAsync(async (req: Request, res: Response) => {
      
      const result = await EmployeeService.createEmployee(req.body);
      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Employee created successfully',
        data: result,
      });
    });

    const getAllEmployees = catchAsync(async (req: Request, res: Response) => {
      const query = req.query;

      const result = await EmployeeService.getAllEmployees(query);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Employees fetched successfully',
        data: result,
      });
    });

    const getEmployeeById = catchAsync(async (req: Request, res: Response) => {
      const result = await EmployeeService.getEmployeeById(req.params.id);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Employee fetched successfully',
        data: result,
      });
    });

    const updateEmployee = catchAsync(async (req: Request, res: Response) => {
    
      const result = await EmployeeService.updateEmployee(req.params.id, req.body);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Employee updated successfully',
        data: result,
      });
    });

    const deleteEmployee = catchAsync(async (req: Request, res: Response) => {
      const result = await EmployeeService.deleteEmployee(req.params.id);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Employee deleted successfully',
        data: result,
      });
    });

    export const EmployeeController = {
      createEmployee,
      getAllEmployees,
      getEmployeeById,
      updateEmployee,
      deleteEmployee,
    };
