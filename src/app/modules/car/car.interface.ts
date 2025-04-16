import { ObjectId } from "mongoose"

export type TCar = {
    carOwner: ObjectId
    carDealer: ObjectId
    carModelId: ObjectId
    companyId: ObjectId
    noOfKmDriven: number
    noOfVarnishField: number
    additionalEquipment: string
    condition: string
    comment: string
    expectedPrice: number
    registrationNumber: string
    vat: number
    carCategory: string
    milage: number
    firstRegistrationDate: string
    chassisNumber: string
    tax: number
    inspectionDate: Date
}