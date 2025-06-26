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
        $match: {},
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

const orderTransport = async (
  user: TAuthUser,
  payload: {
    carModel: string;
    offerCarId: string;
    userId?: string;
    deliveryAddress: string;
    receiverPhone: string;
  },
) => {
  const findOrderTransport = await OrderTransport.findOne({
    userId: user.userId,
  });

  if (!findOrderTransport) {
    throw new Error('Order transport not found');
  }

  let carModel;
  // let carOwner
  let car;

  if (payload.carModel) {
    carModel = (await CarModel.findById(payload.carModel)) as any;

    if (!carModel) {
      throw new Error('Car model not found');
    }

    // carOwner = (await User.findById(payload.userId).populate(
    //   'profile',
    // )) as any;

    car = (await Car.findOne({
      carModelId: payload.carModel,
    }).populate('companyId')) as any;

    const saleCar = await SaleCar.findOne({
      carId: car._id,
    });

    saleCar!.isOrderTransport = true;
    saleCar!.save();

    // if (!carOwner) {
    //   throw new Error('Car owner not found');
    // }
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
    });
  }

  await sendMail({
    email: findOrderTransport?.email,
    subject: 'Order Transport Request',
    html: `
  
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Car Transport Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #f4f4f4;
      padding: 20px;
    }
    .container {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      width: 600px;
      margin: 0 auto;
    }
    h1 {
      color: #2c3e50;
    }
    p {
      font-size: 16px;
    }
    .details {
      margin-top: 20px;
      padding: 10px;
      background-color: #ecf0f1;
      border-radius: 5px;
    }
    .details p {
      margin: 5px 0;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #7f8c8d;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Car Transport Request</h1>
    <p>Dear ${findOrderTransport?.companyName},</p>
    <p>I hope this message finds you well. We are requesting your services for transporting a car from the seller to the buyer. Please find the details below:</p>

<div class="details">
  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <thead>
      <tr>
        <th colspan="2" style="text-align: left; background-color: #f2f2f2; padding: 10px; font-size: 16px;">Car Transport Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Car Details:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          Brand - ${carModel?.brand || carModel?.mark}
          Model - ${carModel?.model}
          Year - ${carModel?.modelYear || carModel?.modelsYear}
          Number Plates - ${carModel?.numberPlates || 'N/A'}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
          Seller Name:
        </td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          ${
            payload.carModel
              ? car?.companyId?.first_name + ' ' + car?.companyId?.last_name
              : car?.firstName + ' ' + car?.lastName
          }
        </td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Seller Address:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          ${car?.companyId?.city || car?.city}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Seller Phone:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          ${car?.companyId?.phoneNumber || car?.phoneNumber}
        </td>
      </tr>

      <p>Delivery Details</p>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
          Receiver Address:
        </td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          ${payload.deliveryAddress}
        </td>
      </tr>

       <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
          Receiver Phone:
        </td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          ${payload.receiverPhone}
        </td>
      </tr>
    </tbody>
  </table>
</div>
    <p>Please confirm if the transport service is available, and let us know the estimated cost and delivery time. If you need any more details, feel free to reach out.</p>
    <p>We look forward to working with you on this transport request.</p>

    <div class="footer">
      <p>Best regards,<br>
      Car Treading<br>
    </p>
    </div>
  </div>
</body>
</html>

    `,
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
