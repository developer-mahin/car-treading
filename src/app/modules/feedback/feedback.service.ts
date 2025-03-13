/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { StatisticHelper } from '../../helper/staticsHelper';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import AppError from '../../utils/AppError';
import User from '../user/user.model';
import { TFeedback } from './feedback.interface';
import Feedback from './feedback.model';

const addFeedback = async (payload: Partial<TFeedback>, userId: string) => {
  const user = (await User.findById(userId).populate('profile')) as any;
  user.profile.feedback = user.profile.feedback + 1;

  const feedbackBody = {
    ...payload,
    staffId: userId,
    restaurantId: user?.myRestaurant,
  };

  const result = await Feedback.create(feedbackBody);
  await user.profile.save();
  return result;
};

const getFeedbackList = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const user = await User.findById(userId);

  const customPipeline = [
    {
      $match: {
        restaurantId: new mongoose.Types.ObjectId(String(user?.restaurantId)),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'staffId',
        foreignField: '_id',
        as: 'staff',
      },
    },
    {
      $unwind: '$staff',
    },
    {
      $lookup: {
        from: 'profiles',
        localField: 'staff.profile',
        foreignField: '_id',
        as: 'profile',
      },
    },
    {
      $unwind: '$profile',
    },
    {
      $project: {
        _id: 1,
        comment: 1,
        status: 1,
        createdAt: 1,
        staffName: '$profile.name',
      },
    },
  ];
  const feedbackAggregation = new AggregationQueryBuilder(query);

  const result = await feedbackAggregation
    .customPipeline(customPipeline)
    .search(['staffName'])
    .filter(['status'])
    .paginate()
    .sort()
    .execute(Feedback);

  const pagination = await feedbackAggregation.countTotal(Feedback);

  return { data: result, pagination };
};

const getFeedbackStatistic = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const { year } = query;

  const user = await User.findById(userId);
  const { startDate, endDate } = StatisticHelper.statisticHelper(
    year as string,
  );

  const result = await Feedback.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        restaurantId: new mongoose.Types.ObjectId(String(user?.restaurantId)),
      },
    },

    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          status: '$status',
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.month',
        status: {
          $push: {
            status: '$_id.status',
            count: '$count',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: '$_id',
        status: 1,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  const statuses = ['pending', 'resolved'];

  const formattedResult = StatisticHelper.formattedResult(
    result,
    'status',
    'status',
    statuses,
  );

  return formattedResult;
};

const updateFeedbackAction = async (
  id: string,
  payload: { status: string },
  userId: string,
) => {
  const user = await User.findById(userId);

  const feedback = await Feedback.findById(id);

  if (!feedback) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Feedback not found');
  }

  if (String(user?.restaurantId) !== String(feedback?.restaurantId)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are not allowed to update this feedback',
    );
  }

  const result = await Feedback.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

export const FeedbackService = {
  addFeedback,
  getFeedbackList,
  getFeedbackStatistic,
  updateFeedbackAction,
};
