import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FeedbackService } from './feedback.service';
import { TAuthUser } from '../../interface/authUser';

const addFeedback = catchAsync(async (req, res) => {
  const { userId } = req.user as TAuthUser;
  const result = await FeedbackService.addFeedback(req.body, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Feedback added successfully',
    data: result,
  });
});

const getFeedbackList = catchAsync(async (req, res) => {
  const { userId } = req.user as TAuthUser;
  const result = await FeedbackService.getFeedbackList(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Feedback fetched successfully',
    data: result.data,
    meta: result.pagination,
  });
});

const getFeedbackStatistic = catchAsync(async (req, res) => {
  const { userId } = req.user as TAuthUser;
  const result = await FeedbackService.getFeedbackStatistic(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Feedback statistic fetched successfully',
    data: result,
  });
});

const updateFeedbackAction = catchAsync(async (req, res) => {
  const { userId } = req.user as TAuthUser;
  const result = await FeedbackService.updateFeedbackAction(
    req.params.id,
    req.body,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Feedback updated successfully',
    data: result,
  });
});

export const FeedbackController = {
  addFeedback,
  getFeedbackList,
  getFeedbackStatistic,
  updateFeedbackAction,
};
