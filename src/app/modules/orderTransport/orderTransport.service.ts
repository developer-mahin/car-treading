import { TAuthUser } from '../../interface/authUser';
import { TOrderTransport } from './orderTransport.interface';
import OrderTransport from './orderTransport.model';

const createOrderTransport = async (
  payload: Partial<TOrderTransport>,
  user: TAuthUser,
) => {
  const result = await OrderTransport.findOneAndUpdate(
    { userId: user.userId },
    {
      ...payload,
      userId: user.userId,
    },
    { new: true, upsert: true },
  );
  return result;
};

const getAllOrderTransports = async (user: TAuthUser) => {
  const result = await OrderTransport.findOne({ userId: user.userId });
  return result;
};

export const OrderTransportService = {
  createOrderTransport,
  getAllOrderTransports,
};
