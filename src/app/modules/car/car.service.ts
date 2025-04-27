import httpStatus from 'http-status';
import { TAuthUser } from '../../interface/authUser';
import AppError from '../../utils/AppError';
import CarModel from '../carModel/carModel.model';
import Company from '../company/company.model';
import Car from './car.model';
import mongoose from 'mongoose';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import SaleCar from '../saleCar/saleCar.model';

/* eslint-disable @typescript-eslint/no-explicit-any */
const carListing = async (payload: any, user: TAuthUser) => {
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
        first_name: payload.first_name,
        last_name: payload.last_name,
        phoneNumber: payload.phoneNumber,
    };

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const createCarModel = await CarModel.create([carModel], { session });
        if (!createCarModel) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Car model creation failed');
        }
        const createCompany = await Company.create([company], { session });
        if (!createCompany) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Company creation failed');
        }

        const car = {
            carOwner: user.userId,
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
        .filter(['carModel.brand', 'carModel.fuelType'])
        .rangeFilter(['carModel.modelYear'])
        .paginate()
        .sort()
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
        dealerId: user.userId,
    };

    const result = await SaleCar.create(saleCarData);

    return result;
};

const getTotalPurchasedCars = async (
    user: TAuthUser,
    query: Record<string, unknown>,
) => {
    const carAggregation = new AggregationQueryBuilder(query);
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
                    carId: '$car._id',
                    expectedPrice: '$car.expectedPrice',
                    carModel: 1,
                    carOwner: {
                        _id: 1,
                        first_name: '$profile.first_name',
                        last_name: '$profile.last_name',
                        profileImage: '$profile.profileImage',
                    },
                },
            },
        ])
        .search(['carOwner.first_name'])
        .paginate()
        .sort()
        .execute(SaleCar);
    const pagination = await carAggregation.countTotal(SaleCar);
    return { pagination, result };
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
    ]);

    return result[0] || null;
};

export const CarService = {
    buyCar,
    carListing,
    getCarList,
    getCarDetails,
    getContactPaper,
    getTotalPurchasedCars,
};
