import { TAuthUser } from '../../interface/authUser';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CarService } from './car.service';

const carListing = catchAsync(async (req, res) => {
  const imagesFiles = Array.isArray(req.files) ? req.files : req.files?.images;
  const images: string[] = [];

  imagesFiles?.forEach((image) => {
    images?.push(image?.path);
    req.body.images = images;
  });

  const result = await CarService.carListing(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Car listed successfully',
    data: result,
  });
});

const buyCar = catchAsync(async (req, res) => {
  const result = await CarService.buyCar(req.body, req.user as TAuthUser);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Car bought successfully',
    data: result,
  });
});

const getCarList = catchAsync(async (req, res) => {
  const result = await CarService.getCarList(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Car listed successfully',
    data: result,
  });
});

const getTotalPurchasedCars = catchAsync(async (req, res) => {
  const result = await CarService.getTotalPurchasedCars(
    req.user as TAuthUser,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Total purchased cars fetched successfully',
    data: result,
  });
});

const getCarDetails = catchAsync(async (req, res) => {
  const result = await CarService.getCarDetails(req.params.carId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Car details fetched successfully',
    data: result,
  });
});

const getContactPaper = catchAsync(async (req, res) => {
  const result = await CarService.getContactPaper(req.params.carId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Contact paper fetched successfully',
    data: result,
  });
});

const getMyBuyedCars = catchAsync(async (req, res) => {
  const result = await CarService.getMyBuyedCars(
    req.user as TAuthUser,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'My buyed cars fetched successfully',
    data: result,
  });
});

const getCVR = catchAsync(async (req, res) => {
  const result = await CarService.getCVR(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'CVR fetched successfully',
    data: result,
  });
});

const getCarInfo = catchAsync(async (req, res) => {
  const result = await CarService.getCarInfo(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'CVR fetched successfully',
    data: result,
  });
});

const updateCar = catchAsync(async (req, res) => {
  const result = await CarService.updateCar(req.params.carId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Car updated successfully',
    data: result,
  });
});

const deleteCar = catchAsync(async (req, res) => {
  const result = await CarService.deleteCar(req.params.carId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Car deleted successfully',
    data: result,
  });
});

export const CarController = {
  getCVR,
  getCarInfo,
  buyCar,
  getCarList,
  carListing,
  getMyBuyedCars,
  getCarDetails,
  updateCar,
  getContactPaper,
  getTotalPurchasedCars,
  deleteCar,
};
