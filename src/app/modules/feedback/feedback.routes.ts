import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import validateRequest from '../../middleware/validation';
import { FeedbackValidation } from './feedback.validation';
import { FeedbackController } from './feedback.controller';

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.STAFF),
    validateRequest(FeedbackValidation.feedbackValidation),
    FeedbackController.addFeedback,
  )
  .get(
    '/feedback_list',
    auth(USER_ROLE.RESTAURANT_OWNER),
    FeedbackController.getFeedbackList,
  )
  .get(
    '/feedback_statistic',
    auth(USER_ROLE.RESTAURANT_OWNER),
    FeedbackController.getFeedbackStatistic,
  )
  .patch(
    '/action/:id',
    auth(USER_ROLE.RESTAURANT_OWNER),
    validateRequest(FeedbackValidation.feedbackUpdateValidation),
    FeedbackController.updateFeedbackAction,
  );

export const FeedbackRoutes = router;
