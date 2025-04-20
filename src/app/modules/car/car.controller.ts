import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CarService } from './car.service';

const carListing = catchAsync(async (req, res) => {
  const result = await CarService.carListing(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Car listed successfully',
    data: result,
  });
});

export const CarController = {
  carListing,
};
