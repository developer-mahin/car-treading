import { ObjectId } from "mongoose"

export type TSaleCar = {
    carId: ObjectId;
    dealerId: ObjectId;
}