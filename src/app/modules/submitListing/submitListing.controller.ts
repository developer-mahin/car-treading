import { TAuthUser } from '../../interface/authUser';
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

const getMySubmitListing = catchAsync(async (req, res) => {
  const result = await SubmitListingService.getMySubmitListing(
    req.user as TAuthUser,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Listing fetched successfully',
    data: result,
  });
});

const updateSubmitListing = catchAsync(async (req, res) => {
  const result = await SubmitListingService.updateSubmitListing(
    req.params.submitListingId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Listing updated successfully',
    data: result,
  });
});

const deleteSubmitListing = catchAsync(async (req, res) => {
  const result = await SubmitListingService.deleteSubmitListing(
    req.params.submitListingId,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Listing deleted successfully',
    data: result,
  });
});

export const SubmitListingController = {
  createSubmitListing,
  getSubmitListing,
  getMySubmitListing,
  updateSubmitListing,
  deleteSubmitListing,
};
