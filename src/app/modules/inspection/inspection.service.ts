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
  let pipeline: any[] = [
    {
      $sort: {
        lastInspectionDate: -1,
      },
    },
    ...(user && user.role === 'CUSTOMER'
      ? [{ $match: { customer: user.id } }]
      : []),
    {
      $group: {
        _id: {
          product: '$product',
          customer: '$customer',
        },
        doc: { $first: '$$ROOT' },
      },
    },
    {
      $replaceRoot: { newRoot: '$doc' },
    },
    {
      $lookup: {
        from: 'customers',
        localField: 'customer',
        foreignField: '_id',
        as: 'customerInfo',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'productInfo',
      },
    },
    {
      $unwind: '$customerInfo',
    },
    {
      $unwind: '$productInfo',
    },
  ];

  if (queryFields.search) {
    pipeline.push({
      $match: {
        $or: [
          { sku: { $regex: queryFields.search, $options: 'i' } },
          { serialNo: { $regex: queryFields.search, $options: 'i' } },
          { enStandard: { $regex: queryFields.search, $options: 'i' } },
          { protocolId: { $regex: queryFields.search, $options: 'i' } },
          {
            'customerInfo.companyName': {
              $regex: queryFields.search,
              $options: 'i',
            },
          },
          {
            'customerInfo.email': {
              $regex: queryFields.search,
              $options: 'i',
            },
          },
          {
            'customerInfo.contactPerson': {
              $regex: queryFields.search,
              $options: 'i',
            },
          },
          {
            'productInfo.name': {
              $regex: queryFields.search,
              $options: 'i',
            },
          },
        ],
      },
    });
  }

  if (page && limit) {
    //@ts-ignore
    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });
  } else {
    //@ts-ignore
    pipeline.push({ $skip: 0 }, { $limit: 10 });
  }
  //@ts-ignore
  const result = await Inspection.aggregate(pipeline);

  const formattedResult = result.map((item: any) => ({
    _id: item._id,
    product: {
      _id: item.productInfo._id,
      name: item.productInfo.name,
      image: item.productInfo.image,
    },

    customer: {
      _id: item.customerInfo._id,
      companyName: item.customerInfo.companyName,
      contactPerson: item.customerInfo.contactPerson,
    },
    sku: item.sku,
    enStandard: item.enStandard,
    serialNo: item.serialNo,
    protocolId: item.protocolId,
    lastInspectionDate: item.lastInspectionDate,
    pdfReport: item.pdfReport || 'Not Available',
  }));

  return formattedResult;
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
