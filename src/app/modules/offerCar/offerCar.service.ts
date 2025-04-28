import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import SubmitListing from '../submitListing/submitListing.model';
import { TOfferCar } from './offerCar.interface';
import OfferCar from './offerCar.model';
import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';

const createOfferCar = async (payload: Partial<TOfferCar>, user: TAuthUser) => {
  const findSubmitListing = await SubmitListing.findOne({
    _id: payload.submitListingCarId,
  });
  if (!findSubmitListing) {
    throw new AppError(httpStatus.NOT_FOUND, 'SubmitListing not found');
  }

  const result = await OfferCar.create({
    ...payload,
    userId: findSubmitListing.userId,
    dealerId: user.userId,
  });
  return result;
};

const getOfferCarList = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const resultQuery = new QueryBuilder(
    OfferCar.find({
      $and: [{ userId: user.userId }, { status: 'pending' }],
    }),
    query,
  )
    .paginate()
    .sort();

  const result = await resultQuery.queryModel;
  const pagination = await resultQuery.countTotal();

  return { pagination, result };
};

const offerCarAction = async (payload: {
  offerCarId: string;
  status: 'accept' | 'reject';
}) => {
  const findOfferCar = await OfferCar.findOne({
    _id: payload.offerCarId,
  });
  if (!findOfferCar) {
    throw new AppError(httpStatus.NOT_FOUND, 'OfferCar not found');
  }
  findOfferCar.status = payload.status;
  await findOfferCar.save();
  return findOfferCar;
};

export const OfferCarService = {
  createOfferCar,
  getOfferCarList,
  offerCarAction,
};
