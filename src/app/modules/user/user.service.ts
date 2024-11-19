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

const getHomeData = async (): Promise<any> => {
  try {
    const [customers, products] = await Promise.all([
      Customer.find(),
      Product.find(),
    ]);

    const todaysDate = new Date();
    const thirtyDaysFromNow = new Date(todaysDate);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const inspections = products
      .filter((product: any) => {
        const nextInspectionDate = product.nextInspectionDate
          ? new Date(product.nextInspectionDate)
          : null;

        // Include products that are either:
        // 1. Due for inspection in the next 30 days
        // 2. Already delayed (past due date)
        return (
          nextInspectionDate &&
          ((nextInspectionDate >= todaysDate &&
            nextInspectionDate <= thirtyDaysFromNow) ||
            nextInspectionDate < todaysDate)
        );
      })
      .map(product => {
        const nextInspectionDate = product.nextInspectionDate
          ? new Date(product.nextInspectionDate)
          : null;

        const isDelayed = nextInspectionDate
          ? nextInspectionDate < todaysDate
          : false;

        return {
          id: product._id,
          latestInspectionDate: product.latestInspectionDate || null,
          nextInspectionDate: product.nextInspectionDate || null,
          inspectionInterval: product.inspectionInterval || null,
          name: product.name,
          brand: product.brand,
          type: product.type,
          inspectionHistory: product.inspectionHistory || [],
          inspectionDelayedTime: product.nextInspectionDate
            ? Number(
                (
                  new Date(product.nextInspectionDate).getDay() -
                  todaysDate.getDay()
                )
                  .toString()
                  .split('-')[1]
              )
            : null,
          isDelayed, // New flag to indicate if inspection is delayed
        } as any;
      })
      // Sort delayed inspections first, then by next inspection date
      .sort((a, b) => {
        // Put delayed inspections first
        if (a.isDelayed && !b.isDelayed) return -1;
        if (!a.isDelayed && b.isDelayed) return 1;

        // Then sort by next inspection date
        const dateA = a.nextInspectionDate
          ? new Date(a.nextInspectionDate)
          : new Date(0);
        const dateB = b.nextInspectionDate
          ? new Date(b.nextInspectionDate)
          : new Date(0);
        return dateA.getTime() - dateB.getTime();
      });

    return {
      customers: customers.length,
      products: products.length,
      upcomingInspections: inspections,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      customers: 0,
      products: 0,
      upcomingInspections: [],
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
