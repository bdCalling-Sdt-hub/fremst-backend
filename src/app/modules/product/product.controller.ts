import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { ProductService } from './product.service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  let data = req.body;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    data.image = `/images/${req.files.image[0].filename}`;
  }
  const result = await ProductService.createProductToDB(data);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const search: any = req.query.search || '';
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const result = await ProductService.getAllProducts(
    search as string,
    page as number,
    limit as number
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    pagination: {
      page: page as number,
      limit: limit as number,
      totalPage: Math.ceil((result.length || 0) / (limit as number)),
      total: result.length || 0,
    },
    message: 'Products fetched successfully',
    data: result,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProductById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product fetched successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  if (req.files && 'image' in req.files && req.files.image[0]) {
    req.body.image = `/images/${req.files.image[0].filename}`;
  }
  const result = await ProductService.updateProduct(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.deleteProduct(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
