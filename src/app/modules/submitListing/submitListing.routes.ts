import { Router } from 'express';
import { SubmitListingController } from './submitListing.controller';

const router = Router();

router
  .post(
    '/create',
    // auth(USER_ROLE.private_user),
    SubmitListingController.createSubmitListing,
  )
  .get('/', SubmitListingController.getSubmitListing);

export const SubmitListingRoutes = router;
