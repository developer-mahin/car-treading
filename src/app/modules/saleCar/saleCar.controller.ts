import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SaleCarService } from './saleCar.service';

const updateContactPaper = catchAsync(async (req, res) => {
  const result = await SaleCarService.updateContactPaper(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Contact paper updated successfully',
    data: result,
  });
});

export const SaleCarController = {
  updateContactPaper,
};
