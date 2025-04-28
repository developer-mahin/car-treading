import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import SubmitListing from "../submitListing/submitListing.model";
import { TOfferCar } from "./offerCar.interface";
import OfferCar from "./offerCar.model";
import { TAuthUser } from "../../interface/authUser";

const createOfferCar = async (payload: Partial<TOfferCar>, user: TAuthUser) => {
    const findSubmitListing = await SubmitListing.findOne({ _id: payload.submitListingCarId })

    console.log(findSubmitListing, 'findSubmitListing');

    if (!findSubmitListing) {
        throw new AppError(httpStatus.NOT_FOUND, 'SubmitListing not found')
    }

    const result = await OfferCar.create({ ...payload, userId: findSubmitListing.userId, dealerId: user.userId });
    return result;
};

export const OfferCarService = {
    createOfferCar,
};