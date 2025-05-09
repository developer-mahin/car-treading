import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { StaticContentController } from './staticContent.controller';
import validateRequest from '../../middleware/validation';
import { StaticContentValidation } from './staticContent.validation';

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.admin),
    validateRequest(StaticContentValidation.staticContentValidation),
    StaticContentController.createStaticContent,
  )
  .get(
    '/',
    auth(USER_ROLE.admin),
    StaticContentController.getStaticContent,
  );

export const StaticContentRoutes = router;
