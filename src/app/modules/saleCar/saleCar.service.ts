import mongoose from 'mongoose';
import { TAuthUser } from '../../interface/authUser';
import { TSaleCar } from './saleCar.interface';
import SaleCar from './saleCar.model';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';

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
  const resultAggregation = new AggregationQueryBuilder(query);

  const result = await resultAggregation
    .customPipeline([
      {
        $match: { userId: new mongoose.Types.ObjectId(String(user.userId)) },
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
    ])
    .filter(['status'])
    .paginate()
    .sort()
    .execute(SaleCar);

  const pagination = await resultAggregation.countTotal(SaleCar);

  return { pagination, result };
};

export const SaleCarService = {
  updateContactPaper,
  getSaleCarList,
};
