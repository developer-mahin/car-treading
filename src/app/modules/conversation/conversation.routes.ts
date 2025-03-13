import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { ConversationController } from './conversation.controller';

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.STAFF),
    ConversationController.createConversation,
  )
  .get('/', auth(USER_ROLE.STAFF), ConversationController.getConversationList)
  .get(
    '/:conversationId',
    auth(USER_ROLE.STAFF),
    ConversationController.getMessageBaseOnConversation,
  );

export const ConversationRoutes = router;
