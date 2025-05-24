import { TAuthUser } from '../../interface/authUser';
import { MulterFile } from '../../middleware/imageConverter';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferCarService } from './offerCar.service';

const createOfferCar = catchAsync(async (req, res) => {
  const imagesFile = req.files as { [fieldname: string]: MulterFile[] };

  req.body.carImages = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imagesFile?.images?.forEach((image: any) => {
    req.body.carImages.push(image.path);
  });

  const result = await OfferCarService.createOfferCar(
    req.body,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'OfferCar created successfully',
    data: result,
  });
});

const getOfferCarList = catchAsync(async (req, res) => {
  const result = await OfferCarService.getOfferCarList(
    req.user as TAuthUser,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'OfferCar fetched successfully',
    data: result,
  });
});

const offerCarAction = catchAsync(async (req, res) => {
  const result = await OfferCarService.offerCarAction(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'OfferCar updated successfully',
    data: result,
  });
});

const myOfferCarList = catchAsync(async (req, res) => {
  const result = await OfferCarService.myOfferCarList(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'OfferCar fetched successfully',
    data: result,
  });
});

const updateOfferCarContactPaper = catchAsync(async (req, res) => {
  const result = await OfferCarService.updateOfferCarContactPaper(
    req.body,
    req.params.offerCarId,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'OfferCar updated successfully',
    data: result,
  });
});

export const OfferCarController = {
  createOfferCar,
  getOfferCarList,
  offerCarAction,
  myOfferCarList,
  updateOfferCarContactPaper,
};
