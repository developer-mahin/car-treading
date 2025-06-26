import { Router } from 'express';
import { SubmitListingController } from './submitListing.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';

const router = Router();

router
  .post(
    '/create',
    // auth(USER_ROLE.private_user),
    SubmitListingController.createSubmitListing,
  )
  .get('/', SubmitListingController.getSubmitListing)
  .get(
    '/my_submit_listing',
    auth(USER_ROLE.private_user),
    SubmitListingController.getMySubmitListing,
  )
  .patch(
    '/update/:submitListingId',
    auth(USER_ROLE.private_user),
    SubmitListingController.updateSubmitListing,
  )
  .delete(
    '/delete/:submitListingId',
    auth(USER_ROLE.private_user),
    SubmitListingController.deleteSubmitListing,
  );

export const SubmitListingRoutes = router;
