/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { months, USER_ROLE, USER_STATUS } from '../../constant';
import { StatisticHelper } from '../../helper/staticsHelper';
import { TAuthUser } from '../../interface/authUser';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import sendMail from '../../utils/sendMail';
import CarModel from '../carModel/carModel.model';
import OrderTransport from '../orderTransport/orderTransport.model';
import SaleCar from '../saleCar/saleCar.model';
import User from './user.model';
import Conversation from '../conversation/conversation.model';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import Car from '../car/car.model';
import SubmitListing from '../submitListing/submitListing.model';
import OfferCar from '../offerCar/offerCar.model';
import { orderTransportHtml } from '../../../shared/html/orderTransportHtml';

const getAllUsersList = async (query: Record<string, unknown>) => {
  // const userAggregation = new QueryBuilder(
  //   User.find({}).populate('profile'),
  //   query,
  // );

  // const result = await userAggregation
  //   .search(['profile.first_name', 'last_name', 'email'])
  //   .filter(['role', 'status'])
  //   .paginate()
  //   .sort().queryModel;

  // const pagination = await userAggregation.countTotal();

  const userAggregation = new AggregationQueryBuilder(query);

  const result = await userAggregation
    .customPipeline([
      {
        $match: {
          role: { $in: [USER_ROLE.dealer, USER_ROLE.private_user] },
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
        $unwind: {
          path: '$profile',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ])
    .search(['profile.first_name', 'profile.last name', 'email'])
    .filter(['role', 'status'])
    .sort()
    .paginate()
    .execute(User);

  const pagination = await userAggregation.countTotal(User);

  return {
    data: result,
    pagination,
  };
};

const userDetails = async (userId: string, query: Record<string, unknown>) => {
  const userDetailsAggregation = new AggregationQueryBuilder(query);

  const result = await userDetailsAggregation
    .customPipeline([
      {
        $match: {
          $or: [
            { userId: new mongoose.Types.ObjectId(String(userId)) },
            { dealerId: new mongoose.Types.ObjectId(String(userId)) },
          ],
        },
      },
      {
        $lookup: {
          from: 'cars',
          localField: 'carId',
          foreignField: '_id',
          as: 'car',
        },
      },
      {
        $unwind: {
          path: '$car',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'carmodels',
          localField: 'car.carModelId',
          foreignField: '_id',
          as: 'carModel',
        },
      },
      {
        $unwind: {
          path: '$carModel',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          carName: '$carModel.brand',
          carModel: '$carModel.model',
          color: '$carModel.color',
          status: 1,
          expectedPrice: '$car.expectedPrice',
          carOwner: '$car.carOwner',
          paymentStatus: 1,
          // status: '$saleCar.status',
          dealerId: 1,
          carId: 1,
          saleCarId: '$_id',
        },
      },
    ])
    .sort()
    .paginate()
    .execute(SaleCar);

  const newResult = await Promise.all(
    result.map(async (item: any) => {
      const findConversation = await Conversation.findOne({
        users: { $all: [item.carOwner, item.dealerId], $size: 2 },
      });

      const data = {
        ...item,
        conversationId: findConversation?._id,
      };

      return data;
    }),
  );

  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(String(userId)),
  }).populate('profile');

  const meta = await userDetailsAggregation.countTotal(SaleCar);

  return { meta, result: newResult, user };
};

const getUserRatio = async (year: string) => {
  const { startDate, endDate } = StatisticHelper.statisticHelper(year);

  const result = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        role: { $in: [USER_ROLE.dealer, USER_ROLE.private_user] },
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

  const statuses = [USER_ROLE.private_user, USER_ROLE.dealer];

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
        { $set: { status: USER_STATUS.blocked } },
        { new: true },
      );
      break;

    case 'unblock':
      result = await User.findByIdAndUpdate(
        id,
        { $set: { status: USER_STATUS.active } },
        { new: true },
      );
      break;

    case 'delete':
      result = await User.findOneAndDelete({ _id: id });
      break;
    default:
      break;
  }

  return result;
};

const orderTransport = async (
  user: TAuthUser,
  payload: {
    carModel: string;
    offerCarId: string;
    userId?: string;
    deliveryAddress?: string;
    receiverPhone?: string;
    comments: string;
  },
) => {
  const findOrderTransport = await OrderTransport.findOne({
    userId: user.userId,
  });

  const dealer = await User.findById(user.userId).populate('profile');

  if (!findOrderTransport) {
    throw new Error('Order transport not found');
  }

  let carModel: any;
  // let carOwner
  let car: any;

  if (payload.carModel) {
    carModel = (await CarModel.findById(payload.carModel)) as any;

    if (!carModel) {
      throw new Error('Car model not found');
    }
    car = (await Car.findOne({
      carModelId: payload.carModel,
    })
      .populate('companyId')
      .populate('carOwner')) as any;

    const saleCar = await SaleCar.findOne({
      carId: car._id,
    });

    saleCar!.isOrderTransport = true;
    saleCar!.save();
  }

  if (payload.offerCarId) {
    carModel = (await OfferCar.findById(payload.offerCarId)) as any;

    if (!carModel) {
      throw new Error('Offer car not found');
    }
    carModel.isOrderTransport = true;
    carModel.save();
    car = await SubmitListing.findOne({
      _id: carModel.submitListingCarId,
    }).populate({
      path: 'userId',
      populate: {
        path: 'profile',
      },
    });
  }

  const emails = [
    { email: payload.carModel ? car?.carOwner?.email : car?.userId?.email },
    { email: dealer?.email },
    { email: findOrderTransport?.email },
  ];


  emails.forEach(async (email) => {
    await sendMail({
      email: email.email,
      subject: 'Order Transport Request',
      html: orderTransportHtml(
        findOrderTransport,
        car,
        carModel,
        dealer,
        payload,
      ),
    });
  });

  return;
};

const getTotalCount = async () => {
  const [
    offerCarSold,
    totalSell,
    totalSold,
    totalUser,
    totalDealer,
    carForSell,
    carForBuy,
  ] = await Promise.all([
    OfferCar.countDocuments({ status: 'accept' }),
    SaleCar.countDocuments({ status: 'sell' }),
    SaleCar.countDocuments({ status: 'sold' }),
    User.countDocuments({ role: USER_ROLE.private_user, isDeleted: false }),
    User.countDocuments({ role: USER_ROLE.dealer, isDeleted: false }),
    Car.countDocuments({ isSell: false }),
    SubmitListing.countDocuments({ isOffer: false }),
  ]);

  return {
    totalSell,
    totalSold: totalSold + offerCarSold,
    totalUser,
    totalDealer,
    carForSell,
    carForBuy,
  };
};

const getCustomerMap = async (query: Record<string, unknown>) => {
  const { year } = query;
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31T23:59:59`);

  const result = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        role: { $in: [USER_ROLE.private_user, USER_ROLE.dealer] },
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
      },
    },
    {
      $group: {
        _id: '$month',
        totalSales: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        month: '$_id',
        totalSales: 1,
      },
    },
  ]);

  const monthlyUser = [];

  for (let i = 1; i <= 12; i++) {
    const foundMonth = result.find((item) => item.month === i);
    monthlyUser.push({
      month: months[i - 1],
      totalSales: foundMonth?.totalSales || 0,
    });
  }

  return monthlyUser;
};

const privateUserDetails = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const userDetailsQuery = new QueryBuilder(
    SaleCar.find({
      userId: new mongoose.Types.ObjectId(userId),
    }),
    query,
  );

  const result = await userDetailsQuery
    .search(['status'])
    .filter(['status'])
    .sort()
    .paginate().queryModel;

  const soldCarCount = await SaleCar.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    status: 'sold',
  });

  const saleCarCount = await SaleCar.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    status: 'sell',
  });

  const meta = await userDetailsQuery.countTotal();

  return { meta, result, soldCarCount, saleCarCount };
};

const updateTermAndPrivacy = async (
  user: TAuthUser,
  data: {
    isTermAccepted?: boolean;
    termsDate?: string;
    privacyDate?: string;
    isPrivacyAccepted?: boolean;
  },
) => {
  return await User.findOneAndUpdate(
    { _id: user.userId },
    {
      $set: {
        isTermAccepted: data?.isTermAccepted,
        termsDate: data?.termsDate,
        isPrivacyAccepted: data?.isPrivacyAccepted,
        privacyDate: data?.privacyDate,
      },
    },
    { new: true },
  );
};

const privateUserTotalCar = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const privateUserQuery = new AggregationQueryBuilder(query);

  const result = await privateUserQuery
    .customPipeline([
      {
        $match: {
          carOwner: new mongoose.Types.ObjectId(String(userId)),
        },
      },
      {
        $lookup: {
          from: 'carmodels',
          localField: 'carModelId',
          foreignField: '_id',
          as: 'carModel',
        },
      },
      {
        $unwind: {
          path: '$carModel',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: {
          path: '$company',
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .sort()
    .paginate()
    .execute(Car);

  const meta = await privateUserQuery.countTotal(Car);
  return { meta, result };
};

export const UserService = {
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
