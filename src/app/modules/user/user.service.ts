/* eslint-disable @typescript-eslint/no-explicit-any */
import { USER_ROLE, USER_STATUS } from '../../constant';
import { StatisticHelper } from '../../helper/staticsHelper';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import User from './user.model';

const getAllUsersList = async (query: Record<string, unknown>) => {
  const userAggregation = new AggregationQueryBuilder(query);
  const projection = {
    UID: 1,
    email: 1,
    status: 1,
    profile: {
      profileImage: '$profile.profileImage',
      name: '$profile.name',
      contactNo: '$profile.contactNo',
      totalQuery: '$profile.queryCount',
      feedback: '$profile.feedback',
    },
  };

  const commonPipeline = [
    {
      $match: {
        role: USER_ROLE.STAFF,
      },
    },
    {
      $lookup: {
        from: 'profiles',
        localField: 'profile',
        foreignField: '_id',
        as: 'profile',
      },
    },
    {
      $unwind: '$profile',
    },
  ];

  const result = await userAggregation
    .customPipeline(commonPipeline)
    .search(['email', 'profile.name'])
    .filter(['status'])
    .paginate()
    .customProjection(projection)
    .sort()
    .execute(User);

  const pagination = await userAggregation.countTotal(User);

  return {
    data: result,
    pagination,
  };
};

const getUserRatio = async (year: string) => {
  const { startDate, endDate } = StatisticHelper.statisticHelper(year);

  const result = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        role: { $in: [USER_ROLE.STAFF, USER_ROLE.RESTAURANT_OWNER] },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          role: '$role',
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.month',
        roles: {
          $push: {
            role: '$_id.role',
            count: '$count',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: '$_id',
        roles: 1,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  const statuses = [USER_ROLE.STAFF, USER_ROLE.RESTAURANT_OWNER];

  const formattedResult = StatisticHelper.formattedResult(
    result,
    'roles',
    'role',
    statuses,
  );

  return formattedResult;
};

const userAction = async (id: string, payload: Record<string, unknown>) => {
  let result;
  switch (payload.action) {
    case 'block':
      result = await User.findByIdAndUpdate(
        id,
        { $set: { status: USER_STATUS.INACTIVATED } },
        { new: true },
      );
      break;
    case 'delete':
      result = await User.findByIdAndUpdate(
        id,
        { $set: { isDeleted: true } },
        { new: true },
      );
      break;
    default:
      break;
  }

  return result;
};
export const UserService = {
  getAllUsersList,
  getUserRatio,
  userAction,
};
