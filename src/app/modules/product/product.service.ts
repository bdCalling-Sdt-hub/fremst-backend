import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Product } from './product.model';
import { IProduct } from './product.interface';

const createProduct = async (payload: IProduct): Promise<IProduct> => {
  const result = await Product.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create product!');
  }
  return result;
};

const getAllProducts = async (search: string): Promise<IProduct[]> => {
  let result: any;
  if (search !== '') {
    result = await Product.find({
      $or: [
        { sku: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { serialNo: { $regex: search, $options: 'i' } },
        { enStandard: { $regex: search, $options: 'i' } },
        { inspectionInterval: { $regex: search, $options: 'i' } },
        { latestInspectionDate: { $regex: search, $options: 'i' } },
        { isActive: { $regex: search, $options: 'i' } },
        { inspectionHistory: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
      ],
    });
    return result;
  } else {
    result = await Product.find();
  }
  return result;
};

const getProductById = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not found!');
  }
  return result;
};

const updateProduct = async (
  id: string,
  payload: IProduct
): Promise<IProduct | null> => {
  const result = await Product.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update product!');
  }
  return result;
};

const deleteProduct = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete product!');
  }
  return result;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
