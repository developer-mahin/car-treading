/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { USER_ROLE } from '../../constant';
import { TAuthUser } from '../../interface/authUser';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import AppError from '../../utils/AppError';
import SubmitListing from '../submitListing/submitListing.model';
import { TOfferCar } from './offerCar.interface';
import OfferCar from './offerCar.model';
import sendNotification from '../../../socket/sendNotification';
import { NOTIFICATION_TYPE } from '../notification/notification.interface';

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

  const notification = {
    senderId: user.userId,
    receiverId: findSubmitListing.userId,
    linkId: result._id,
    message: `You have received an offer for your car listing: ${findSubmitListing.mark} ${findSubmitListing.model}`,
    type: NOTIFICATION_TYPE.offer,
    role: USER_ROLE.private_user,
    link: '/dashboard/offer-car',
  };

  await sendNotification(user, notification);

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
    .sort()
    .paginate();

  const result = await resultQuery.queryModel;
  const pagination = await resultQuery.countTotal();

  return { meta: pagination, result };
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

  if (payload.status === 'accept') {
    await SubmitListing.findOneAndUpdate(
      {
        _id: findOfferCar.submitListingCarId,
      },
      {
        $set: {
          isOffer: true,
        },
      },
      {
        new: true,
      },
    );

    const notification = {
      senderId: findOfferCar.userId,
      receiverId: findOfferCar.dealerId,
      linkId: findOfferCar._id,
      message: `Your offer for the car has been accepted: ${findOfferCar.mark} ${findOfferCar.model}`,
      type: NOTIFICATION_TYPE.offer,
      role: USER_ROLE.private_user,
      link: '/dashboard/dealer-offer-car-aggrement',
    };

    const user = {
      userId: findOfferCar.userId,
      role: USER_ROLE.private_user,
    } as any;

    await sendNotification(user, notification);
  }

  return findOfferCar;
};

const myOfferCarList = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const match =
    user.role === USER_ROLE.dealer
      ? { dealerId: new mongoose.Types.ObjectId(String(user.userId)) }
      : { userId: new mongoose.Types.ObjectId(String(user.userId)) };

  const matchStage = {
    $match: match,
  };

  const offerCarQuery = new AggregationQueryBuilder(query);

  const result = await offerCarQuery
    .customPipeline([
      matchStage,
      {
        $lookup: {
          from: 'submitlistings',
          localField: 'submitListingCarId',
          foreignField: '_id',
          as: 'submitListing',
        },
      },
      {
        $unwind: {
          path: '$submitListing',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
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
          from: 'users',
          localField: 'dealerId',
          foreignField: '_id',
          as: 'dealerUser',
        },
      },
      {
        $unwind: {
          path: '$dealerUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'dealerUser.profile',
          foreignField: '_id',
          as: 'dealerUserProfile',
        },
      },
      {
        $unwind: {
          path: '$dealerUserProfile',
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
    .sort()
    .paginate()
    .execute(OfferCar);

  const pagination = await offerCarQuery.countTotal(OfferCar);
  return { meta: pagination, result };
};

const updateOfferCarContactPaper = async (
  payload: Partial<TOfferCar>,
  offerCarId: string,
  user: TAuthUser,
) => {
  const findSaleCar = await OfferCar.findById(offerCarId);

  if (!findSaleCar) {
    throw new AppError(httpStatus.NOT_FOUND, 'SaleCar not found');
  }

  const result = await OfferCar.findByIdAndUpdate(
    offerCarId,
    { ...payload },
    {
      new: true,
    },
  );

  const receiverId =
    user.role === USER_ROLE.dealer ? findSaleCar.userId : findSaleCar.dealerId;
  const link =
    user.role === USER_ROLE.dealer
      ? '/dashboard/private-offer-car-aggrement'
      : '/dashboard/dealer-offer-car-aggrement';

  const notification = {
    senderId: findSaleCar.dealerId,
    receiverId,
    linkId: offerCarId,
    message: `Your offer contact paper has been updated for the car: ${findSaleCar.mark} ${findSaleCar.model}`,
    type: NOTIFICATION_TYPE.offer,
    role: USER_ROLE.private_user,
    link,
  };

  await sendNotification(user, notification);

  return result;
};

const getEveryOfferContact = async (query: Record<string, unknown>) => {
  const resultQuery = new AggregationQueryBuilder(query);

  const result = await resultQuery
    .customPipeline([
      {
        $match: {
          status: 'accept',
        },
      },

      {
        $lookup: {
          from: 'submitlistings',
          localField: 'submitListingCarId',
          foreignField: '_id',
          as: 'submitListing',
        },
      },
      {
        $unwind: {
          path: '$submitListing',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'dealerId',
          foreignField: '_id',
          as: 'dealerUser',
        },
      },
      {
        $unwind: {
          path: '$dealerUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'dealerUser.profile',
          foreignField: '_id',
          as: 'dealerUserProfile',
        },
      },
      {
        $unwind: {
          path: '$dealerUserProfile',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
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
    .sort()
    .paginate()
    .execute(OfferCar);

  const pagination = await resultQuery.countTotal(OfferCar);
  return { pagination, result };
};

export const OfferCarService = {
  createOfferCar,
  getOfferCarList,
  offerCarAction,
  myOfferCarList,
  updateOfferCarContactPaper,
  getEveryOfferContact,
};
