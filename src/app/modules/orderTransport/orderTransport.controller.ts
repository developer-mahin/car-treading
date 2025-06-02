import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderTransportService } from './orderTransport.service';
import { TAuthUser } from '../../interface/authUser';

const createOrderTransport = catchAsync(async (req, res) => {
  const result = await OrderTransportService.createOrderTransport(
    req.body,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order transport created successfully',
    data: result,
  });
});

const getAllOrderTransports = catchAsync(async (req, res) => {
  const result = await OrderTransportService.getAllOrderTransports(
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order transports fetched successfully',
    data: result,
  });
});

export const OrderTransportController = {
  createOrderTransport,
  getAllOrderTransports,
};
