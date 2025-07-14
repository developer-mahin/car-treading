import { TAuthUser } from '../../interface/authUser';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BidService } from './bid.service';

const createBid = catchAsync(async (req, res) => {
  const result = await BidService.createBid(req.body, req.user as TAuthUser);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Bid created successfully',
    data: result,
  });
});

const getBidList = catchAsync(async (req, res) => {
  const result = await BidService.getBidList(req.query, req.user as TAuthUser);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Bids fetched successfully',
    data: result,
  });
});

const bidAction = catchAsync(async (req, res) => {
  const result = await BidService.bidAction(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Bid updated successfully',
    data: result,
  });
});

const myBidList = catchAsync(async (req, res) => {
  const result = await BidService.myBidList(req.query, req.user as TAuthUser);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Bids fetched successfully',
    data: result,
  });
});

export const BidController = {
  createBid,
  getBidList,
  bidAction,
  myBidList,
};
