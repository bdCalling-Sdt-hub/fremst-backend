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

const getAdminsFromDB = async (): Promise<Partial<IUser>[]> => {
  const admins = await User.find({ role: USER_ROLES.ADMIN });
  return admins;
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
const calculateInspectionInterval = (
  startDate: Date,
  endDate: Date
): number => {
  // Calculate the month difference
  const monthDifference =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  // Ensure we return absolute value to handle both future and past dates
  return Math.abs(monthDifference);
};
const getHomeData = async (): Promise<{
  customers: number;
  products: number;
  inspections: (IInspection & { delayedDays?: number })[];
}> => {
  try {
    const [customers, products] = await Promise.all([
      Customer.find(),
      Product.find(),
    ]);

    const todaysDate = new Date();
    const thirtyDaysFromNow = new Date(todaysDate);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Find inspections within the next 30 days, including those that are delayed
    const rawInspections = await Inspection.find({
      isActive: true,
      nextInspectionDate: {
        $lte: thirtyDaysFromNow,
      },
    }).populate({
      path: 'product customer',
      select: 'name', // Only select necessary fields
    });

    // Process inspections to add delayedDays
    const inspections = rawInspections.map(rawInspection => {
      //@ts-ignore
      const inspection = rawInspection._doc;
      // Calculate delayed days if the inspection is past due
      const delayedDays =
        inspection.nextInspectionDate < todaysDate
          ? Math.ceil(
              (todaysDate.getTime() - inspection.nextInspectionDate.getTime()) /
                (1000 * 3600 * 24)
            )
          : undefined;
      const inspectionInterval = `${calculateInspectionInterval(
        new Date(
          inspection.inspectionDate
            ? inspection.inspectionDate
            : inspection.createdAt
        ),
        new Date(inspection.nextInspectionDate)
      )} month`;

      return {
        ...inspection,
        inspectionInterval,
        delayedDays,
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

export const UserService = {
  createUserToDB,
  getAdminsFromDB,
  getHomeData,
  getUserProfileFromDB,
  deleteAdminByID,
  getAdminByID,
  updateProfileToDB,
};
