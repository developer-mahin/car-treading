import { TAuthUser } from '../../interface/authUser';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ConversationService } from './conversation.service';

const createConversation = catchAsync(async (req, res) => {
  const result = await ConversationService.createConversation(
    req.body,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Conversation created successfully',
    data: result,
  });
});

const getMyConverSation = catchAsync(async (req, res) => {
  const result = await ConversationService.getMyConverSation(
    req.user as TAuthUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Conversation fetched successfully',
    data: result,
  });
});

const getConversationMessages = catchAsync(async (req, res) => {
  const result = await ConversationService.getConversationMessages(
    req.params.conversationId,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Conversation fetched successfully',
    data: result,
  });
});

export const ConversationController = {
  createConversation,
  getMyConverSation,
  getConversationMessages,
};
