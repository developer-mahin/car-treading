import { TSaleCar } from './saleCar.interface';

const updateContactPaper = async (payload: Partial<TSaleCar>) => {
  console.log(payload);
};

export const SaleCarService = {
  updateContactPaper,
};
