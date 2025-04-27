import { TSaleCar } from './saleCar.interface';
import SaleCar from './saleCar.model';

const updateContactPaper = async (payload: Partial<TSaleCar>, saleCarId: string) => {

  const result = await SaleCar.findByIdAndUpdate(saleCarId, payload, {
    new: true,
  })

  return result

  
};

export const SaleCarService = {
  updateContactPaper,
};
