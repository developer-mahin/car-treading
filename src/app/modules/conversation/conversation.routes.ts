import { Router } from 'express';
import { USER_ROLE } from '../../constant';
import { auth } from '../../middleware/auth';
import { ConversationController } from './conversation.controller';

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.private_user, USER_ROLE.dealer),
    ConversationController.createConversation,
  )
  .get(
    '/',
    auth(USER_ROLE.private_user, USER_ROLE.dealer),
    ConversationController.getMyConverSation,
  )
  .get(
    '/message/:conversationId',
    auth(USER_ROLE.private_user, USER_ROLE.dealer, USER_ROLE.admin),
    ConversationController.getConversationMessages,
  );

export const ConversationRoutes = router;
