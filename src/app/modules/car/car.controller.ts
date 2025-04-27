import { TAuthUser } from '../../interface/authUser';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CarService } from './car.service';

const carListing = catchAsync(async (req, res) => {

  const imagesFiles = Array.isArray(req.files) ? req.files : req.files?.images;
  const images: string[] = []

  imagesFiles?.forEach((image) => {
    images?.push(image?.path);
    req.body.images = images
  })

  const result = await CarService.carListing(req.body, req.user as TAuthUser);

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
