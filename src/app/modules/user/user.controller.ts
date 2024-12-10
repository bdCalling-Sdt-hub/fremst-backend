import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let profile;
    if (req.files && 'profile' in req.files && req.files.profile[0]) {
      profile = `/profiles/${req.files.profile[0].filename}`;
    }

    const data = {
      profile,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);
const getAdmins = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await UserService.getAdminsFromDB(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    pagination: {
      page: 1,
      limit: 10,
      totalPage: Math.ceil((result.length || 0) / 10),
      total: result.length || 0,
    },
    message: 'Admins fetched successfully',
    data: result,
  });
});
const getAdminByID = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getAdminByID(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin fetched successfully',
    data: result,
  });
});
const deleteAdminByID = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteAdminByID(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin deleted successfully',
    data: result,
  });
});

const getHomeData = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getHomeData();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Home data fetched successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getHomeData,
  getUserProfile,
  updateProfile,
  getAdminByID,
  getAdmins,
  deleteAdminByID,
};
