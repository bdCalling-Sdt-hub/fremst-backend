import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Product } from './product.model';
import { IProduct } from './product.interface';
import { ProductValidation } from './product.validation';

const createProductToDB = async (
  payload: Partial<IProduct>
): Promise<IProduct> => {
  // Validate payload
  await ProductValidation.createProductZodSchema.parseAsync({
    ...payload,
    // @ts-ignore
    isActive: payload.isActive === 'true' ? true : false,
  });

  const finalPayload = {
    ...payload,
  };

  const result = await Product.create(finalPayload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create product!');
  }

  return result;
};

const getAllProducts = async (
  search: string,
  page: number | null,
  limit: number | null
): Promise<IProduct[]> => {
  const query = search
    ? {
        $or: [
          { sku: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { type: { $regex: search, $options: 'i' } },
          { serialNo: { $regex: search, $options: 'i' } },
          { enStandard: { $regex: search, $options: 'i' } },
          { inspectionInterval: { $regex: search, $options: 'i' } },
          { latestInspectionDate: { $regex: search, $options: 'i' } },
          { inspectionHistory: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { contactPerson: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  let queryBuilder = Product.find(query);
  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }

  return await queryBuilder;
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
  const isExistProduct = await Product.findById(id);
  if (!isExistProduct) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not found!');
  }
  if (payload.inspectionHistory) {
    payload.inspectionHistory = JSON.parse(
      //@ts-ignore
      payload.inspectionHistory.replace(/'/g, '"')
    );
  }
  if (payload.image && payload.image !== '/images/default.png') {
    await isExistProduct.image;
  }
  await ProductValidation.updateProductZodSchema.parseAsync(payload);
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
  createProductToDB,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
