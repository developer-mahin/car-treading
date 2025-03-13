import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ConversationService } from './conversation.service';

const createConversation = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await ConversationService.createConversation(req.body, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Conversation created successfully',
    data: result,
  });
});

const getConversationList = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await ConversationService.getConversationList(
    userId,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Conversations fetched successfully',
    data: result?.result,
    meta: result?.meta,
  });
});

const getMessageBaseOnConversation = catchAsync(async (req, res) => {
  const { conversationId } = req.params;

  const result =
    await ConversationService.getMessageBaseOnConversation(conversationId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Messages fetched successfully',
    data: result,
  });
});

export const ConversationController = {
  createConversation,
  getConversationList,
  getMessageBaseOnConversation,
};
