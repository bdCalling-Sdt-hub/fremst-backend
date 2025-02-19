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
    const searchConditions = queryFields?.search
      ? {
          $or: [
            { sku: { $regex: queryFields.search, $options: 'i' } },
            { serialNo: { $regex: queryFields.search, $options: 'i' } },
            { enStandard: { $regex: queryFields.search, $options: 'i' } },
            { 'product.name': { $regex: queryFields.search, $options: 'i' } },
            { 'customer.name': { $regex: queryFields.search, $options: 'i' } },
            {
              'customer.companyName': {
                $regex: queryFields.search,
                $options: 'i',
              },
            },
          ],
        }
      : {};

    // Prepare customer condition if user is customer
    const customerCondition =
      user?.role === USER_ROLES.CUSTOMER
        ? { customer: new Types.ObjectId(user.id) }
        : {};

    // Calculate pagination
    const skip = ((page || 1) - 1) * (limit || 10);
    const paginationLimit = limit || 10;

    const pipeline = [
      // First lookup product
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        },
      },
      // Then lookup customer
      {
        $lookup: {
          from: 'customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer',
        },
      },
      // Unwind product array to object
      {
        $unwind: '$product',
      },
      // Unwind customer array to object
      {
        $unwind: '$customer',
      },
      // Apply customer filter if exists
      ...(Object.keys(customerCondition).length
        ? [
            {
              $match: customerCondition,
            },
          ]
        : []),
      // Apply search if exists
      ...(Object.keys(searchConditions).length
        ? [
            {
              $match: searchConditions,
            },
          ]
        : []),
      // Sort by date
      {
        $sort: { lastInspectionDate: -1 },
      },
      // Get total count before pagination
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $skip: skip },
            { $limit: paginationLimit },
            // Project only needed fields
            {
              $project: {
                _id: 1,
                'product.name': 1,
                'product.image': 1,
                'product.type': 1,
                'customer.name': 1,
                'customer.email': 1,
                'customer.companyName': 1,
                'customer.contactPerson': 1,
                'customer.address': 1,
                sku: 1,
                serialNo: 1,
                enStandard: 1,
                lastInspectionDate: 1,
                pdfReport: 1,
              },
            },
          ],
        },
      },
    ];

    const [result] = await Inspection.aggregate(pipeline);

    const totalCount = result.metadata[0]?.total || 0;
    const transformedResults = result.data.map((item: any) => ({
      _id: item._id,
      product: {
        name: item.product?.name || 'N/A',
        image: item.product?.image || 'N/A',
        type: item.product?.type || 'N/A',
      },
      customer: {
        name: item.customer?.name || 'N/A',
        email: item.customer?.email || 'N/A',
        companyName: item.customer?.companyName || 'N/A',
        contactPerson: item.customer?.contactPerson || 'N/A',
        address: item.customer?.address || 'N/A',
      },
      sku: item.sku || 'N/A',
      serialNo: item.serialNo || 'N/A',
      enStandard: item.enStandard || 'N/A',
      lastInspectionDate: item.lastInspectionDate,
      pdfReport:
        typeof item.pdfReport === 'string' ? item.pdfReport : 'Not Available',
    }));

    return {
      results: transformedResults,
      pagination: {
        currentPage: page || 1,
        totalPages: Math.ceil(totalCount / paginationLimit),
        totalItems: totalCount,
        itemsPerPage: paginationLimit,
      },
    };
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
