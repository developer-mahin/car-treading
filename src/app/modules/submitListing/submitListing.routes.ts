import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { SubmitListingController } from './submitListing.controller';

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.private_user),
    SubmitListingController.createSubmitListing,
  )
  .get('/', SubmitListingController.getSubmitListing);

export const SubmitListingRoutes = router;
