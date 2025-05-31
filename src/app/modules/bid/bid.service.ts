/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import Car from '../car/car.model';
import { TBid } from './bid.interface';
import Bid from './bid.model';
import { TAuthUser } from '../../interface/authUser';
import mongoose from 'mongoose';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import SaleCar from '../saleCar/saleCar.model';
import sendNotification from '../../../socket/sendNotification';
import { NOTIFICATION_TYPE } from '../notification/notification.interface';
import { USER_ROLE } from '../../constant';
import Notification from '../notification/notification.model';

const createBid = async (payload: Partial<TBid>, user: TAuthUser) => {
  const car = await Car.findById(payload.carId);

  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }

  const result = await Bid.create({
    ...payload,
    userId: car.carOwner,
    carId: car._id,
    dealerId: user.userId,
  });

  const unreadNotification = await Notification.find({
    receiverId: car.carOwner,
    isRead: false,
  }).countDocuments()

  const notification = {
    senderId: user.userId,
    receiverId: car.carOwner,
    linkId: result._id as any,
    message: `You have received a bid on ${Car.modelName}`,
    type: NOTIFICATION_TYPE.bid,
    role: user.role,
    count: unreadNotification + 1,
  }; 

  await sendNotification(user, notification);

  // car.isSell = true;
  // await car.save();
  return result;
};

const getBidList = async (query: Record<string, unknown>, user: TAuthUser) => {
  const resultAggregation = new AggregationQueryBuilder(query);

  const result = await resultAggregation
    .customPipeline([
      {
        $match: {
          $and: [
            { userId: new mongoose.Types.ObjectId(String(user.userId)) },
            { status: 'pending' },
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
          modelYear: '$carModel.modelYear',
          bidAmount: 1,
          carId: 1,
        },
      },
    ])
    .paginate()
    .sort()
    .execute(Bid);

  const pagination = await resultAggregation.countTotal(Bid);
  return { meta: pagination, result };
};

const bidAction = async (payload: {
  bidCarId: string;
  status: 'accepted' | 'rejected';
  carId: string;
}) => {
  const findBidCar = await Bid.findById(payload.bidCarId);
  if (!findBidCar) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bid not found');
  }

  if (payload.status === 'accepted') {
    await SaleCar.create({
      carId: payload.carId,
      userId: findBidCar.userId,
      dealerId: findBidCar.dealerId,
    });

    const updateCar = await Car.findOneAndUpdate(
      { _id: payload.carId },
      { isSell: true, isBid: true, bidPrice: findBidCar.bidAmount },
      { new: true },
    );

    const notification = {
      senderId: findBidCar.userId,
      receiverId: findBidCar.dealerId,
      linkId: payload.carId as any,
      message: `You bid has been accepted`,
      type: NOTIFICATION_TYPE.bid,
      role: USER_ROLE.private_user,
    };

    const user = {
      userId: findBidCar.dealerId,
      role: USER_ROLE.dealer,
    } as any

    await sendNotification(user, notification);

    if (!updateCar) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
    }
  }
  await Bid.findOneAndUpdate(
    { _id: payload.bidCarId },
    { status: payload.status },
    { new: true },
  );
};

export const BidService = {
  createBid,
  getBidList,
  bidAction,
};
