import { Router } from 'express';
import { CarController } from './car.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import validateRequest from '../../middleware/validation';
import { CarValidation } from './car.validation';
import upload from '../../utils/uploadImage';
import parseFormData from '../../middleware/parsedData';

const router = Router();

router.post(
  '/sale_car',
  auth(USER_ROLE.dealer, USER_ROLE.private_user),
  validateRequest(CarValidation.carListingValidationSchema),
  upload.fields([
    { name: "images", maxCount: 10 },
  ]),
  parseFormData,
  CarController.carListing,
).get("/sale_car_list", auth(USER_ROLE.dealer, USER_ROLE.private_user), CarController.getCarList);

export const CarRoutes = router;
