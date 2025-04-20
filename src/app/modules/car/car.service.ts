import { TCarListing } from './car.interface';

const carListing = async (payload: TCarListing) => {
    const car = payload.car
    const carModel = payload.carModel
    const company = payload.company

    return { car, carModel, company }
};

export const CarService = {
    carListing,
};
