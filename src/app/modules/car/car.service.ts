import { TCarListing } from './car.interface';

const carListing = async (payload: any) => {
    const car = payload.car
    const carModel = payload.carModel
    const company = payload.company

    return payload
};

export const CarService = {
    carListing,
};
