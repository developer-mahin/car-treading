import { TAuthUser } from '../../interface/authUser';
import { TOrderTransport } from './orderTransport.interface';
import OrderTransport from './orderTransport.model';

const createOrderTransport = async (
  payload: Partial<TOrderTransport>,
  user: TAuthUser,
) => {
  const result = await OrderTransport.create({
    ...payload,
    userId: user.userId,
  });
  return result;
};

export const OrderTransportService = {
  createOrderTransport,
};
