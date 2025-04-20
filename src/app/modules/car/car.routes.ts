import { Router } from 'express';
import { CarController } from './car.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import validateRequest from '../../middleware/validation';
import { CarValidation } from './car.validation';

const router = Router();

router.post(
  '/listing',
  auth(USER_ROLE.dealer, USER_ROLE.private_user),
  validateRequest(CarValidation.carListingValidationSchema),
  CarController.carListing,
);

export const CarRoutes = router;
