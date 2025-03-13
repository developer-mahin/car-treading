import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

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

export const UserController = {
  getAllUsersList,
  getUserRatio,
  userAction,
};
