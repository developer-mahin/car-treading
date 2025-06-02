import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StaticContentService } from './staticContent.service';
import { TAuthUser } from '../../interface/authUser';

const createStaticContent = catchAsync(async (req, res) => {
  const result = await StaticContentService.createStaticContent(
    req.user as TAuthUser,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Static content created successfully',
    data: result,
  });
});

const getStaticContent = catchAsync(async (req, res) => {
  const result = await StaticContentService.getStaticContent(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Static content fetched successfully',
    data: result,
  });
});

export const StaticContentController = {
  createStaticContent,
  getStaticContent,
};
