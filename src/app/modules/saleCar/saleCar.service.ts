import mongoose from 'mongoose';
import { TAuthUser } from '../../interface/authUser';
import { TSaleCar } from './saleCar.interface';
import SaleCar from './saleCar.model';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import { months, USER_ROLE } from '../../constant';

const updateContactPaper = async (
  payload: Partial<TSaleCar>,
  saleCarId: string,
) => {
  const result = await SaleCar.findByIdAndUpdate(saleCarId, payload, {
    new: true,
  });

  return result;
};

const getSaleCarList = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  let matchStage = {};

  if (user.role === USER_ROLE.admin) {
    matchStage = {
      $match: {},
    };
  } else {
    matchStage = {
      $match: { userId: new mongoose.Types.ObjectId(String(user.userId)) },
    };
  }

  const resultAggregation = new AggregationQueryBuilder(query);

  const result = await resultAggregation
    .customPipeline([
      matchStage,
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
        $lookup: {
          from: 'companies',
          localField: 'car.companyId',
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
      {
        $lookup: {
          from: 'users',
          localField: 'dealerId',
          foreignField: '_id',
          as: 'dealer',
        },
      },
      {
        $unwind: {
          path: '$dealer',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'dealer.profile',
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
        $lookup: {
          from: 'users',
          localField: 'car.carOwner',
          foreignField: '_id',
          as: 'privateUser',
        },
      },
      {
        $unwind: {
          path: '$privateUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'privateUser.profile',
          foreignField: '_id',
          as: 'privateUserProfile',
        },
      },
      {
        $unwind: {
          path: '$privateUserProfile',
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .filter(['status'])
    .paginate()
    .sort()
    .execute(SaleCar);

  const pagination = await resultAggregation.countTotal(SaleCar);

  return { meta: pagination, result };
};

const getTotalSalesChart = async (query: Record<string, unknown>) => {
  const { year } = query;
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31T23:59:59`);

  const result = await SaleCar.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'sold',
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

  const monthlySales = [];
  for (let i = 1; i <= 12; i++) {
    const foundMonth = result.find((item) => item.month === i);
    monthlySales.push({
      month: months[i - 1],
      totalSales: foundMonth ? foundMonth.totalSales : 0,
    });
  }

  return monthlySales;
};

const saleCarAction = async (payload: {
  action: 'paid' | 'unpaid';
  saleCarId: string;
}) => {
  const result = await SaleCar.findByIdAndUpdate(
    payload.saleCarId,
    { paymentStatus: payload.action },
    {
      new: true,
    },
  );
  return result;
};

export const SaleCarService = {
  updateContactPaper,
  getSaleCarList,
  getTotalSalesChart,
  saleCarAction,
};
