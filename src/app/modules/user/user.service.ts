import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { Customer } from '../customer/customer.model';
import { Product } from '../product/product.model';
import { Inspection } from '../inspection/inspection.model';
import { IInspection } from '../inspection/inspection.interface';
import { calculateInspectionInterval } from '../../../helpers/calculateInterval';

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  let createUser;
  if (payload?.password?.length! < 8) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Password must be at least 8 characters'
    );
  }
  if (payload.role === USER_ROLES.SUPERADMIN) {
    const isExistAdmin = await User.findOne({ role: USER_ROLES.SUPERADMIN });
    if (isExistAdmin) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Super admin already exist');
    }
  }
  createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  // //send email
  // const otp = generateOTP();
  // const values = {
  //   name: createUser.name,
  //   otp: otp,
  //   email: createUser.email!,
  // };
  // const createAccountTemplate = emailTemplate.createAccount(values);
  // emailHelper.sendEmail(createAccountTemplate);

  // //save to DB
  // const authentication = {
  //   oneTimeCode: otp,
  //   expireAt: new Date(Date.now() + 3 * 60000),
  // };
  // await User.findOneAndUpdate(
  //   { _id: createUser._id },
  //   { $set: { authentication } }
  // );

  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.profile) {
    unlinkFile(isExistUser.profile);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};
const getAdminsFromDB = async (
  query: Record<string, string>
): Promise<IUser[]> => {
  const { search, page, limit } = query;
  try {
    const skip = (Number(page) - 1) * Number(limit);
    const query = search
      ? {
          $or: [
            { name: { $regex: new RegExp(search, 'i') } },
            { email: { $regex: new RegExp(search, 'i') } },
          ],
        }
      : {};

    return await User.find(query).lean().skip(skip).limit(Number(limit)).exec();
  } catch (error) {
    throw new Error(`Error fetching customers: ${error}`);
  }
};

const getAdminByID = async (id: string): Promise<Partial<IUser>> => {
  const admin = await User.findOne({ _id: id, role: USER_ROLES.ADMIN });
  if (!admin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
  }
  return admin;
};
const deleteAdminByID = async (id: string): Promise<Partial<IUser>> => {
  const admin = await User.findOneAndDelete({
    _id: id,
    role: USER_ROLES.ADMIN,
  });
  if (!admin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
  }
  return admin;
};

const getHomeData = async (
  user: any
): Promise<{
  customers: number;
  products: number;
  inspections: any[];
}> => {
  try {
    const [customers, products] = await Promise.all([
      User.find(user.role === USER_ROLES.CUSTOMER ? { email: user.email } : {}),
      Product.find(),
    ]);
    const todaysDate = new Date();
    const thirtyDaysFromNow = new Date(todaysDate);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 720);

    const rawInspections = await Inspection.find({
      isActive: true,
      $or: [
        { nextInspectionDate: { $lt: todaysDate } },
        { nextInspectionDate: { $lte: thirtyDaysFromNow, $gte: todaysDate } },
      ],
    }).populate({
      path: 'product customer',
      select: 'name brand companyName contactPerson',
    });

    const inspections = rawInspections.map(rawInspection => {
      //@ts-ignore
      const inspection = rawInspection._doc;
      const delayedDays =
        inspection.nextInspectionDate < todaysDate
          ? Math.ceil(
              (todaysDate.getTime() - inspection.nextInspectionDate.getTime()) /
                (1000 * 3600 * 24)
            )
          : 0;
      const inspectionInterval = `${calculateInspectionInterval(
        new Date(
          inspection.inspectionDate
            ? inspection.inspectionDate
            : inspection.createdAt
        ),
        new Date(inspection.nextInspectionDate)
      )} month`;

      return {
        _id: inspection._id,
        sku: inspection.sku,
        enStandard: inspection.enStandard,
        serialNo: inspection.serialNo,
        type: inspection.product?.type,
        isActive: inspection.isActive,
        productImage: inspection.productImage,
        summery: inspection.product?.summery || '',
        isApproved: inspection.product?.isApproved || false,
        lastInspectionDate: inspection.lastInspectionDate,
        nextInspectionDate: inspection.nextInspectionDate,
        createdAt: inspection.createdAt,
        name: inspection.product?.name || '',
        brand: inspection.brand || '',
        pdfReport:
          inspection.pdfReport ||
          '/pdfReports/besiktningsprotokoll-(english-(american))-(kopia)-(1)-1733827853863.pdf',
        companyName: inspection.companyName || '',
        username: inspection.username || '',
        inspectionInterval,
        delayedDays: delayedDays,
      };
    });

    return {
      customers: customers.length,
      products: products.length,
      inspections,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      customers: 0,
      products: 0,
      inspections: [],
    };
  }
};
const holdUser = async (id: string): Promise<Partial<string>> => {
  const isExistUser = await User.findOne({
    _id: id,
    role: { $ne: USER_ROLES.SUPERADMIN },
  });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  const user = await User.findOneAndUpdate(
    { _id: id, role: { $ne: USER_ROLES.SUPERADMIN } },
    { status: isExistUser.status === 'active' ? 'hold' : 'active' }
  );
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  const status = await User.findOne({
    _id: id,
    role: { $ne: USER_ROLES.SUPERADMIN },
  })
    .select('status')
    .lean();
  if (!status) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return status?.status.toString();
};
const isHold = async (id: string): Promise<Partial<boolean>> => {
  const user = await User.findOne({
    _id: id,
  });
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return user.status === 'hold';
};
export const UserService = {
  createUserToDB,
  getAdminsFromDB,
  holdUser,
  getHomeData,
  getUserProfileFromDB,
  deleteAdminByID,
  getAdminByID,
  updateProfileToDB,
  isHold,
};
