import { ObjectId } from 'mongoose';
import { TCarModel } from '../carModel/carModel.interface';
import { TCompany } from '../company/company.interface';

export type TCar = {
  carOwner: ObjectId;
  carModelId: ObjectId;
  companyId: ObjectId;
  noOfKmDriven: number;
  noOfVarnishField: number;
  additionalEquipment: [string];
  condition: string;
  comment: string;
  expectedPrice: number;
  registrationNumber: string;
  vat: string;
  carCategory: string;
  milage: number;
  firstRegistrationDate: string;
  chassisNumber: string;
  tax: string;
  inspectionDate: Date;
  isSell: boolean;
  isBid: boolean;
  bidPrice: number;
};

export type TCarListing = {
  car: Partial<TCar>;
  carModel: TCarModel;
  company: TCompany;
};
