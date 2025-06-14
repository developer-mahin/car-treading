import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import { TAuthUser } from '../../interface/authUser';

const getAllUsersList = catchAsync(async (req, res) => {
  const { data, pagination } = await UserService.getAllUsersList(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users fetched successfully',
    meta: pagination,
    data: data,
  });
});

const getUserRatio = catchAsync(async (req, res) => {
  const result = await UserService.getUserRatio(req.query.year as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users fetched successfully',
    data: result,
  });
});

const userAction = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserService.userAction(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: result,
  });
});

const orderTransport = catchAsync(async (req, res) => {
  const result = await UserService.orderTransport(
    req.user as TAuthUser,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully mail send',
    data: result,
  });
});

const getTotalCount = catchAsync(async (req, res) => {
  const result = await UserService.getTotalCount();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total count fetched successfully',
    data: result,
  });
});

const getCustomerMap = catchAsync(async (req, res) => {
  const result = await UserService.getCustomerMap(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer map fetched successfully',
    data: result,
  });
});

const userDetails = catchAsync(async (req, res) => {
  const result = await UserService.userDetails(req.params.userId, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User details fetched successfully',
    data: result,
  });
});

const privateUserDetails = catchAsync(async (req, res) => {
  const result = await UserService.privateUserDetails(
    req.params.userId,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User details fetched successfully',
    data: result,
  });
});

const updateTermAndPrivacy = catchAsync(async (req, res) => {
  const result = await UserService.updateTermAndPrivacy(
    req.user as TAuthUser,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User details fetched successfully',
    data: result,
  });
});

const privateUserTotalCar = catchAsync(async (req, res) => {
  const result = await UserService.privateUserTotalCar(
    req.params.userId,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User details fetched successfully',
    data: result,
  });
});

export const UserController = {
  getAllUsersList,
  userDetails,
  getUserRatio,
  userAction,
  orderTransport,
  getTotalCount,
  getCustomerMap,
  privateUserDetails,
  updateTermAndPrivacy,
  privateUserTotalCar,
};
