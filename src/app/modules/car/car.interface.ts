import { ObjectId } from 'mongoose';
import { TCarModel } from '../carModel/carModel.interface';
import { TCompany } from '../company/company.interface';

export type TCar = {
    carOwner: ObjectId;
    carDealer: ObjectId;
    carModelId: ObjectId;
    companyId: ObjectId;
    noOfKmDriven: number;
    noOfVarnishField: number;
    additionalEquipment: string;
    condition: string;
    comment: string;
    expectedPrice: number;
    registrationNumber: string;
    vat: number;
    carCategory: string;
    milage: number;
    firstRegistrationDate: string;
    chassisNumber: string;
    tax: number;
    inspectionDate: Date;
};

export type TCarListing = {
    car: Partial<TCar>;
    carModel: TCarModel;
    company: TCompany;
};
