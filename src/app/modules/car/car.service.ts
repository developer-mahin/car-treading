import httpStatus from "http-status";
import { TAuthUser } from "../../interface/authUser";
import AppError from "../../utils/AppError";
import CarModel from "../carModel/carModel.model";
import Company from "../company/company.model";
import Car from "./car.model";
import mongoose from "mongoose";
import AggregationQueryBuilder from "../../QueryBuilder/aggregationBuilder";

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
    }

    const company = {
        companyName: payload.companyName,
        cvrNumber: payload.cvrNumber,
        postCode: payload.postCode,
        city: payload.city,
        first_name: payload.first_name,
        last_name: payload.last_name,
        phoneNumber: payload.phoneNumber,
    }

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
        }

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

    const { modelYearFrom, modelYearTo, drivenKmFrom, drivenKmTo } = query

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
                    preserveNullAndEmptyArrays: true
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
                    preserveNullAndEmptyArrays: true
                }
            }
        ])
        .filter(["carModel.brand", "carModel.fuelType"])
        .rangeFilter(["carModel.modelYear"])
        .paginate()
        .sort()
        .execute(Car);

    const filterCar = result.filter((car: any) => {
        let matches = true;

        // Check model year filter
        if (modelYearFrom && modelYearTo) {
            matches = matches && car.carModel.modelYear >= modelYearFrom && car.carModel.modelYear <= modelYearTo;
        }

        // Check driven km filter
        if (drivenKmFrom && drivenKmTo) {
            matches = matches && car.noOfKmDriven >= drivenKmFrom && car.noOfKmDriven <= drivenKmTo;
        }

        return matches;
    });


    const pagination = await carAggregation.countTotal(Car);

    return { pagination, result: filterCar ? filterCar : result };
}

export const CarService = {
    carListing,
    getCarList
};
