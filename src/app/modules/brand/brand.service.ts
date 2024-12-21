import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Brand } from './brand.model';
import { IBrand } from './brand.interface';

const createBrand = async (payload: IBrand): Promise<IBrand> => {
  const result = await Brand.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create brand!');
  }
  return result;
};

const getAllBrands = async (
  queryFields: Record<string, any>
): Promise<IBrand[]> => {
  const { search, page, limit } = queryFields;
  const query = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }] }
    : {};
  let queryBuilder = Brand.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }
  delete queryFields.search;
  delete queryFields.page;
  delete queryFields.limit;
  queryBuilder.find(queryFields);
  return await queryBuilder;
};

const getBrandById = async (id: string): Promise<IBrand | null> => {
  const result = await Brand.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Brand not found!');
  }
  return result;
};

const updateBrand = async (
  id: string,
  payload: IBrand
): Promise<IBrand | null> => {
  const isExistBrand = await getBrandById(id);
  if (!isExistBrand) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Brand not found!');
  }

  const result = await Brand.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update brand!');
  }
  return result;
};

const deleteBrand = async (id: string): Promise<IBrand | null> => {
  const isExistBrand = await getBrandById(id);
  if (!isExistBrand) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Brand not found!');
  }

  const result = await Brand.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete brand!');
  }
  return result;
};

export const BrandService = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
