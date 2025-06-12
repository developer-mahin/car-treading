import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SubmitListingService } from './submitListing.service';

const createSubmitListing = catchAsync(async (req, res) => {
  const result = await SubmitListingService.createSubmitListing(
    req.body,
    // req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Listing created successfully',
    data: result,
  });
});

const getSubmitListing = catchAsync(async (req, res) => {
  const result = await SubmitListingService.getSubmitListing(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Listing fetched successfully',
    data: result,
  });
});

export const SubmitListingController = {
  createSubmitListing,
  getSubmitListing,
};
