import axios from 'axios';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../../config';
import { USER_ROLE } from '../../constant';
import { TAuthUser } from '../../interface/authUser';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import AppError from '../../utils/AppError';
import sendMail from '../../utils/sendMail';
import { TBrandModel } from '../brandModel/brandModel.interface';
import BrandModel from '../brandModel/brandModel.model';
import CarModel from '../carModel/carModel.model';
import Company from '../company/company.model';
import OfferCar from '../offerCar/offerCar.model';
import Profile from '../profile/profile.model';
import SaleCar from '../saleCar/saleCar.model';
import User from '../user/user.model';
import Car from './car.model';
import generateUID from '../../utils/generateUid';
import { NOTIFICATION_TYPE } from '../notification/notification.interface';
import sendNotification from '../../../socket/sendNotification';
import { cacheData, getCachedData } from '../../../redis';

/* eslint-disable @typescript-eslint/no-explicit-any */
const carListing = async (payload: any) => {
  const findCar = await Car.findOne({
    registrationNumber: payload.registrationNumber,
    isSell: false,
  });

  if (findCar) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Car already listed');
  }

  const carModel = {
    images: payload.images,
    brand: payload.brand,
    model: payload.model,
    modelYear: payload.modelYear,
    variant: payload.variant,
    color: payload.color,
    fuelType: payload.fuelType,
    gearBox: payload.gearBox,
    engineSize: payload.engineSize,
    enginePerformance: payload.enginePerformance,
    co2Emission: payload.co2Emission,
    fuelConsumption: payload.fuelConsumption,
    euroStandard: payload.euroStandard,
    numberPlates: payload.numberPlates,
  };

  const company = {
    companyName: payload.companyName,
    cvrNumber: payload.cvrNumber,
    postCode: payload.postCode,
    city: payload.city,
    street: payload.street,
    first_name: payload.first_name,
    last_name: payload.last_name,
    phoneNumber: payload.phoneNumber,
    email: payload.email,
  };

  const defaultPassword = Math.floor(10000000 + Math.random() * 90000000);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    let createdUser;
    if (!payload.userId) {
      createdUser = await User.create(
        [
          {
            email: payload.email,
            password: defaultPassword,
            role: USER_ROLE.private_user,
            needPasswordChange: true,
            uuid: await generateUID(),
          },
        ],
        { session },
      );

      const profileData = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        phoneNumber: payload.phoneNumber,
        userId: createdUser[0]._id,
      };

      const profile = await Profile.create([profileData], { session });
      if (!profile || profile.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Profile not created');
      }

      await User.findByIdAndUpdate(
        createdUser[0]._id,
        { profile: profile[0]._id },
        { new: true, session },
      );

      await sendMail({
        email: payload.email,
        subject: 'Change Your Password Please',
        html: `
      <h1>Change Your Password Your Default Password is ${defaultPassword}</h1>
      `,
      });
    }

    const createCarModel = await CarModel.create([carModel], { session });
    if (!createCarModel) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car model creation failed');
    }
    const createCompany = await Company.create([company], { session });
    if (!createCompany) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Company creation failed');
    }

    const car = {
      carOwner: payload?.userId || createdUser?.[0]._id,
      carModelId: createCarModel[0]._id,
      companyId: createCompany[0]._id,
      noOfKmDriven: payload.noOfKmDriven,
      noOfVarnishField: payload.noOfVarnishField,
      additionalEquipment: payload.additionalEquipment,
      condition: payload.condition,
      comment: payload.comment,
      expectedPrice: payload.expectedPrice,
      registrationNumber: payload.registrationNumber,
      vat: payload.vat,
      carCategory: payload.carCategory,
      milage: payload.milage,
      firstRegistrationDate: payload.firstRegistrationDate,
      chassisNumber: payload.chassisNumber,
      tax: payload.tax,
      inspectionDate: payload.inspectionDate,
    };

    const createCar = await Car.create([car], { session });
    if (!createCar) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car creation failed');
    }

    await session.commitTransaction();
    await session.endSession();
    return createCar;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error);
  }
};

const getCarList = async (query: Record<string, unknown>) => {
  const { modelYearFrom, modelYearTo, drivenKmFrom, drivenKmTo } = query;

  const carAggregation = new AggregationQueryBuilder(query);

  const result = await carAggregation
    .customPipeline([
      {
        $match: {
          isSell: false,
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
      {
        $lookup: {
          from: 'bids',
          localField: '_id',
          foreignField: 'carId',
          as: 'bids',
          pipeline: [{ $sort: { bidAmount: -1 } }, { $limit: 1 }],
        },
      },
      {
        $unwind: {
          path: '$bids',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'bids',
          let: { carId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$carId', '$$carId'] } } },
            { $count: 'totalBids' },
          ],
          as: 'bidsCount',
        },
      },
      {
        $addFields: {
          totalBidCount: {
            $ifNull: [{ $arrayElemAt: ['$bidsCount.totalBids', 0] }, 0],
          },
        },
      },
      {
        $project: {
          _id: 1,
          carOwner: 1,
          carModelId: 1,
          companyId: 1,
          noOfKmDriven: 1,
          noOfVarnishField: 1,
          additionalEquipment: 1,
          condition: 1,
          comment: 1,
          expectedPrice: 1,
          registrationNumber: 1,
          vat: 1,
          carCategory: 1,
          milage: 1,
          firstRegistrationDate: 1,
          chassisNumber: 1,
          tax: 1,
          inspectionDate: 1,
          createdAt: 1,
          updatedAt: 1,
          isSell: 1,
          maxBidAmount: '$bids.bidAmount',
          carModel: 1,
          company: 1,
          totalBidCount: 1,
        },
      },
    ])
    .filter(['carModel.brand', 'carModel.fuelType'])
    .rangeFilter(['carModel.modelYear'])
    .sort()
    .paginate()
    .execute(Car);

  const filterCar = result.filter((car: any) => {
    let matches = true;

    // Check model year filter
    if (modelYearFrom && modelYearTo) {
      matches =
        matches &&
        car.carModel.modelYear >= modelYearFrom &&
        car.carModel.modelYear <= modelYearTo;
    }

    // Check driven km filter
    if (drivenKmFrom && drivenKmTo) {
      matches =
        matches &&
        car.noOfKmDriven >= drivenKmFrom &&
        car.noOfKmDriven <= drivenKmTo;
    }

    return matches;
  });

  const pagination = await carAggregation.countTotal(Car);

  return { pagination, result: filterCar ? filterCar : result };
};

const buyCar = async (payload: any, user: TAuthUser) => {
  const { carId } = payload;
  const car = await Car.findById(carId);

  if (!car) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Car not found');
  }

  const saleCarData = {
    carId: carId,
    userId: car.carOwner,
    dealerId: user.userId,
  };

  const findSaleCar = await SaleCar.findOne({
    carId: carId,
  });

  if (findSaleCar) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Car already sold');
  }

  const result = await SaleCar.create(saleCarData);
  car.isSell = true;
  await car.save();

  const notification = {
    senderId: user.userId,
    receiverId: car.carOwner,
    linkId: result._id,
    message: `Congratulations! your car has been sell`,
    type: NOTIFICATION_TYPE.car,
    role: USER_ROLE.dealer,
    link: '/dashboard/total-private-car-sell',
  };

  await sendNotification(user, notification);

  return result;
};

const getTotalPurchasedCars = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {

  const cacheKey = `purchasedCars:${user.userId}:${JSON.stringify(query)}`;

  // Try to fetch from Redis cache first
  const cached = await getCachedData<{ meta: any; result: any }>(cacheKey);
  if (cached) {
    console.log('🚀 Serving from Redis cache');
    return cached;
  }

  const carAggregation = new AggregationQueryBuilder(query);
  // return
  const result = await carAggregation
    .customPipeline([
      {
        $match: {
          dealerId: new mongoose.Types.ObjectId(String(user.userId)),
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
          localField: 'car.carOwner',
          foreignField: '_id',
          as: 'carOwner',
        },
      },
      {
        $unwind: {
          path: '$carOwner',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'carOwner.profile',
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
          _id: 1,
          // carId: '$car._id',
          customerDestination: 1,
          isOrderTransport: 1,
          price: 1,
          status: 1,
          paymentStatus: 1,
          reRegistrationDeRegistrationView: 1,
          signatureAsDealer: 1,
          signatureAsOwner: 1,
          isAggrade: 1,
          isMoms: 1,
          advancedPayment: 1,
          car: 1,
          expectedPrice: '$car.expectedPrice',
          carModel: 1,
          createdAt: 1,
          updatedAt: 1,
          carOwner: {
            _id: 1,
            first_name: '$profile.first_name',
            last_name: '$profile.last_name',
            profileImage: '$profile.profileImage',
          },
          company: 1,
        },
      },
    ])
    .search(['carOwner.first_name'])
    .sort()
    .paginate()
    .execute(SaleCar);
  const pagination = await carAggregation.countTotal(SaleCar);

  const dataToCache = { meta: pagination, result };

  // Cache result for 60 seconds (you can change the TTL)
  await cacheData(cacheKey, dataToCache, 60);

  return dataToCache;
};

const getCarDetails = async (carId: string) => {
  const result = await Car.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(String(carId)),
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
  ]);

  return result[0] || null;
};

const getContactPaper = async (carId: string) => {
  const result = await SaleCar.aggregate([
    {
      $match: {
        carId: new mongoose.Types.ObjectId(String(carId)),
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

    {
      $project: {
        _id: 1,
        customerDestination: 1,
        price: 1,
        status: 1,
        paymentStatus: 1,
        reRegistrationDeRegistrationView: 1,
        signatureAsDealer: 1,
        signatureAsOwner: 1,
        isAggrade: 1,
        isMoms: 1,
        advancedPayment: 1,
        carId: '$car._id',
        car: 1,
        expectedPrice: '$car.expectedPrice',
        carModel: 1,
        company: 1,
        dealer: {
          _id: 1,
          first_name: '$profile.first_name',
          last_name: '$profile.last_name',
          email: '$dealer.email',
          phoneNumber: '$profile.phoneNumber',
          profileImage: '$profile.profileImage',
          address: '$profile.address',
          city: '$profile.city',
          cvrNumber: '$profile.cvrNumber',
          street: '$profile.street',
          zip: '$profile.zip',
          websiteLink: '$profile.websiteLink',
        },
        privateUser: {
          _id: 1,
          first_name: '$privateUserProfile.first_name',
          last_name: '$privateUserProfile.last_name',
          email: '$privateUser.email',
          phoneNumber: '$privateUserProfile.phoneNumber',
          profileImage: '$privateUserProfile.profileImage',
          address: '$privateUserProfile.address',
          city: '$privateUserProfile.city',
          cvrNumber: '$privateUserProfile.cvrNumber',
          street: '$profile.street',
          zip: '$privateUserProfile.zip',
          websiteLink: '$privateUserProfile.websiteLink',
        },
      },
    },
  ]);

  return result[0] || null;
};

const getMyBuyedCars = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const resultAggregation = new AggregationQueryBuilder(query);
  const result = await resultAggregation
    .customPipeline([
      {
        $match: {
          $and: [
            { userId: new mongoose.Types.ObjectId(String(user.userId)) },
            { status: 'accept' },
          ],
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
    ])
    .sort()
    .paginate()
    .execute(OfferCar);

  const pagination = await resultAggregation.countTotal(OfferCar);

  return { meta: pagination, result };
};

const getCVR = async (query: Record<string, unknown>) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.cvr_key}`,
  };

  const res = await axios.get(
    `https://api.virksomhedsapi.dk/cvr/${query.cvrNumber}`,
    { headers },
  );

  return res.data;
};

const getCarInfo = async (query: Record<string, unknown>) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.car_key}`,
  };

  const res = await axios.get(`https://api.nrpla.de/${query.carNumber}`, {
    headers,
  });

  return res.data;
};

const updateCar = async (carId: string, payload: any) => {
  const car = {
    noOfKmDriven: payload.noOfKmDriven,
    noOfVarnishField: payload.noOfVarnishField,
    additionalEquipment: payload.additionalEquipment,
    condition: payload.condition,
    comment: payload.comment,
    expectedPrice: payload.expectedPrice,
    registrationNumber: payload.registrationNumber,
    vat: payload.vat,
    carCategory: payload.carCategory,
    milage: payload.milage,
    firstRegistrationDate: payload.firstRegistrationDate,
    chassisNumber: payload.chassisNumber,
    tax: payload.tax,
    inspectionDate: payload.inspectionDate,
  };
  const carModel = {
    images: payload.images,
    brand: payload.brand,
    model: payload.model,
    modelYear: payload.modelYear,
    variant: payload.variant,
    color: payload.color,
    fuelType: payload.fuelType,
    gearBox: payload.gearBox,
    engineSize: payload.engineSize,
    enginePerformance: payload.enginePerformance,
    co2Emission: payload.co2Emission,
    fuelConsumption: payload.fuelConsumption,
    euroStandard: payload.euroStandard,
    numberPlates: payload.numberPlates,
  };

  const company = {
    companyName: payload.companyName,
    cvrNumber: payload.cvrNumber,
    postCode: payload.postCode,
    city: payload.city,
    street: payload.street,
    first_name: payload.first_name,
    last_name: payload.last_name,
    phoneNumber: payload.phoneNumber,
  };

  const findCar = await Car.findById(carId);
  if (!findCar) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Car not found');
  }

  await Car.findOneAndUpdate({ _id: carId }, car, { new: true });

  await CarModel.findOneAndUpdate({ _id: findCar.carModelId }, carModel, {
    new: true,
  });

  await Company.findOneAndUpdate({ _id: findCar.companyId }, company, {
    new: true,
  });
};

const deleteCar = async (carId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const findCar = await Car.findById(carId).session(session);
    if (!findCar) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car not found');
    }

    // Delete car and related docs inside the session
    await Car.findByIdAndDelete(carId).session(session);
    await CarModel.findByIdAndDelete(findCar.carModelId).session(session);
    await Company.findByIdAndDelete(findCar.companyId).session(session);
    await SaleCar.findOneAndDelete({ carId: carId }).session(session);

    await session.commitTransaction();
    session.endSession();

    return findCar;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const addBrand = async (payload: TBrandModel) => {
  return await BrandModel.create(payload);
};

const getBrand = async () => {
  return await BrandModel.find({});
};

const deleteBrand  = async (brandId: string) => {
  return await BrandModel.findByIdAndDelete(brandId);
};

export const CarService = {
  getCVR,
  addBrand,
  getBrand,
  buyCar,
  getCarInfo,
  carListing,
  getCarList,
  getMyBuyedCars,
  getCarDetails,
  updateCar,
  getContactPaper,
  getTotalPurchasedCars,
  deleteCar,
  deleteBrand
};
