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
  );
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
