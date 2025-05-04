import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MessageService } from './message.service';

const uploadImage = catchAsync(async (req, res) => {
  req.body.image = req?.file?.path;
  const result = await MessageService.uploadImage(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Image uploaded successfully',
    data: result,
  });
});

const deleteImage = catchAsync(async (req, res) => {
  const result = await MessageService.deleteImage(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Image deleted successfully',
    data: result,
  });
});

export const MessageController = {
  uploadImage,
  deleteImage,
};
