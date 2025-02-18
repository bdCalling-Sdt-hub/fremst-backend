import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Inspection } from './inspection.model';
import { IInspection } from './inspection.interface';
import { InspectionValidation } from './inspection.validation';
import { calculateInspectionInterval } from '../../../helpers/calculateInterval';
import { OldInspection } from '../oldInspection/oldInspection.model';
import { OldInspectionService } from '../oldInspection/oldInspection.service';
import { Step } from '../step/step.model';
import { IStep } from '../step/step.interface';
import { Question } from '../question/question.model';
import { USER_ROLES } from '../../../enums/user';
import { SchemaTypes, Types } from 'mongoose';

const createInspection = async (payload: IInspection): Promise<any> => {
  await InspectionValidation.createInspectionZodSchema.parseAsync(payload);
  payload.nextInspectionDate = new Date(payload.nextInspectionDate);
  const result = await Inspection.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create inspection!');
  }
  return { ...payload };
};

const getAllInspections = async (queryFields: any, user: any): Promise<any> => {
  const { page, limit } = queryFields;
  if (queryFields.customer && queryFields.product) {
    const inspectionHistory = await Inspection.find({
      customer: queryFields.customer,
      product: queryFields.product,
    }).sort({ lastInspectionDate: -1 });
    const rawLatestInspection: any = await Inspection.findOne({
      customer: queryFields.customer,
      product: queryFields.product,
    })
      .sort({ lastInspectionDate: -1 })
      .populate({
        path: 'product customer',
        select: 'name brand type isActive companyName image contactPerson',
      });

    const latestInspection = {
      sku: rawLatestInspection?.sku,
      productName: rawLatestInspection?.product?.name,
      brand: rawLatestInspection?.brand,
      type: rawLatestInspection?.type,
      serialNo: rawLatestInspection?.serialNo,
      enStandard: rawLatestInspection?.enStandard,
      lastInspectionDate: rawLatestInspection?.lastInspectionDate,
      nextInspectionDate: rawLatestInspection?.nextInspectionDate,
      isActive: rawLatestInspection?.isActive,
      companyName: rawLatestInspection?.companyName,
      username: rawLatestInspection?.username,
      inspectionInterval: `${calculateInspectionInterval(
        new Date(rawLatestInspection?.lastInspectionDate),
        new Date(rawLatestInspection?.nextInspectionDate)
      )} Months`,
      productImage: rawLatestInspection?.productImage,
      pdfReport: rawLatestInspection?.pdfReport || 'Not Available',
      _id: rawLatestInspection?._id,
    };

    const oldInspectionHistory = await OldInspection.find({
      customer: queryFields.customer,
      product: queryFields.product,
    })
      .sort({ lastInspectionDate: -1 })
      .select('lastInspectionDate _id pdfReport');

    const history = [
      ...inspectionHistory,
      ...(oldInspectionHistory ? oldInspectionHistory : []),
    ];
    const finalFistory = await Promise.all(
      history.map(async (item: any) => {
        return {
          _id: item._id,
          lastInspectionDate: item.lastInspectionDate,
          pdfReport: item.pdfReport || 'Not Available',
        };
      })
    );
    return { latestInspection, history: finalFistory };
  }

  // let pipeline = [
  //   {
  //     $sort: {
  //       lastInspectionDate: -1,
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: {
  //         product: '$product',
  //         customer: '$customer',
  //       },
  //       doc: { $first: '$$ROOT' },
  //     },
  //   },
  //   {
  //     $replaceRoot: { newRoot: '$doc' },
  //   },
  //   {
  //     $lookup: {
  //       from: 'customers',
  //       localField: 'customer',
  //       foreignField: '_id',
  //       as: 'customerInfo',
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'products',
  //       localField: 'product',
  //       foreignField: '_id',
  //       as: 'productInfo',
  //     },
  //   },
  //   {
  //     $unwind: '$customerInfo',
  //   },
  //   {
  //     $unwind: '$productInfo',
  //   },
  // ];
  try {
    let query = Inspection.find()
      .populate({
        path: 'product',
        select: 'name image type',
      })
      .populate({
        path: 'customer',
        select: 'name email companyName contactPerson address',
      })
      .sort({ lastInspectionDate: -1 });

    // If user is customer, only show their inspections
    if (user?.role === USER_ROLES.CUSTOMER) {
      query = query.where('customer', user.id);
    }

    // Basic search
    if (queryFields?.search) {
      const searchRegex = new RegExp(queryFields.search, 'i');
      query = query.find({
        $or: [
          { 'product.name': searchRegex },
          { 'customer.companyName': searchRegex },
          { 'customer.contactPerson': searchRegex },
          { 'customer.email': searchRegex },
          { 'customer.address': searchRegex },
          { sku: searchRegex },
          { serialNo: searchRegex },
          { enStandard: searchRegex },
          { protocolId: searchRegex },
          { 'product.type': searchRegex },
        ],
      });
    }

    // Simple pagination
    const skip = ((page || 1) - 1) * (limit || 10);
    query = query.skip(skip).limit(limit || 10);

    const result = await query.lean();

    return result.map((item: any) => ({
      _id: item._id,
      product: {
        name: item.product.name,
        image: item.product.image,
        type: item.product.type,
      },
      customer: {
        name: item.customer.name,
        email: item.customer.email,
        companyName: item.customer.companyName,
        contactPerson: item.customer.contactPerson,
        address: item.customer.address,
      },
      sku: item.sku,
      serialNo: item.serialNo,
      enStandard: item.enStandard,
      lastInspectionDate: item.lastInspectionDate,
      pdfReport:
        // @ts-ignore
        typeof item.pdfReport === 'string' ? item.pdfReport : 'Not Available',
    }));
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error retrieving inspections'
    );
  }
};

const getInspectionById = async (id: string): Promise<any> => {
  const data: any = await Inspection.findById(id).populate({
    path: 'product customer',
    select: 'name brand type isActive companyName image contactPerson',
  });
  if (!data) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Inspection not found!');
  }
  const inspectionInterval = `${calculateInspectionInterval(
    new Date(data.inspectionDate ? data.inspectionDate : data.createdAt),
    new Date(data.nextInspectionDate)
  )} month`;
  // const history = await getAllInspections(null, null, {
  //   customer: data.customer._id,
  //   product: data.product._id,
  // });
  const result = {
    sku: data.sku,
    productName: data.product.name,
    brand: data.product.brand,
    type: data.product.type,
    serialNo: data.serialNo,
    enStandard: data.enStandard,
    lastInspectionDate: data.lastInspectionDate,
    nextInspectionDate: data.nextInspectionDate,
    isActive: data.isActive,
    companyName: data.companyName,
    username: data.username,
    inspectionInterval: inspectionInterval,
    productImage: data.productImage,
    pdfReport:
      data.pdfReport ||
      '/pdfReports/besiktningsprotokoll-(english-(american))-(kopia)-(1)-1733827853863.pdf',
    _id: data._id,
  };
  return result;
};

const updateInspection = async (
  id: string,
  payload: IInspection
): Promise<IInspection | null> => {
  // await InspectionValidation.updateInspectionZodSchema.parseAsync(payload);
  const isExistInspection = await getInspectionById(id);
  if (!isExistInspection) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Inspection not found!');
  }
  const result = await Inspection.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update inspection!');
  }
  return isExistInspection;
};

const deleteInspection = async (id: string): Promise<any | null> => {
  const isExistInspection = await Inspection.findById(id);
  if (!isExistInspection) {
    const result = await OldInspectionService.deleteOldInspection(id);
    return result;
  }
  const latestInspection = await Inspection.findOne({
    customer: isExistInspection.customer,
    product: isExistInspection.product,
  }).sort({ lastInspectionDate: -1 });
  if (latestInspection?._id.toString() === isExistInspection._id.toString()) {
    await Inspection.deleteMany({
      customer: isExistInspection.customer,
      product: isExistInspection.product,
    });
    await OldInspection.deleteMany({
      customer: isExistInspection.customer,
      product: isExistInspection.product,
    });
    return isExistInspection;
  }
  const result = await Inspection.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete inspection!');
  }
  return result;
};

const getFullInspectionInfo = async (productID: string): Promise<any> => {
  const steps = await Step.find({ product: productID });
  if (!steps) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Steps not found!');
  }
  const result = await Promise.all(
    steps.map(async (step: IStep) => {
      const questions = await Question.find({ stepID: step._id })
        .select('question isComment -_id')
        .lean();
      if (!questions) {
        return [];
      }
      return {
        step: step.name,
        stepImage: step.stepImage,
        questions,
      };
    })
  );
  return result;
};

export const InspectionService = {
  createInspection,
  getAllInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
  getFullInspectionInfo,
};
