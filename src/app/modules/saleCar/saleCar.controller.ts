import { TAuthUser } from '../../interface/authUser';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SaleCarService } from './saleCar.service';

const updateContactPaper = catchAsync(async (req, res) => {
  const fields = ['signatureAsOwner', 'signatureAsDealer'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const files = req.files as any;

  for (const field of fields) {
    if (files[field]) {
      req.body[field] = files[field][0].path;
    }
  }

  const result = await SaleCarService.updateContactPaper(
    req.body,
    req.params.saleCarId,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Contact paper updated successfully',
    data: result,
  });
});

const getSaleCarList = catchAsync(async (req, res) => {
  const result = await SaleCarService.getSaleCarList(
    req.user as TAuthUser,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'SaleCar fetched successfully',
    data: result,
  });
});

const getTotalSalesChart = catchAsync(async (req, res) => {
  const result = await SaleCarService.getTotalSalesChart(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Total sales chart fetched successfully',
    data: result,
  });
});

const saleCarAction = catchAsync(async (req, res) => {
  const result = await SaleCarService.saleCarAction(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'SaleCar updated successfully',
    data: result,
  });
});

const allCarList = catchAsync(async (req, res) => {
  const result = await SaleCarService.allCarList(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'All car list fetched successfully',
    data: result,
  });
});

export const SaleCarController = {
  updateContactPaper,
  getSaleCarList,
  getTotalSalesChart,
  saleCarAction,
  allCarList,
};
