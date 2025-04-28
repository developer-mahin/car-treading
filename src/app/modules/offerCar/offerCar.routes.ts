import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { OfferCarController } from './offerCar.controller';
import upload from '../../utils/uploadImage';
import parseFormData from '../../middleware/parsedData';

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.dealer),
    upload.fields([{ name: 'images', maxCount: 10 }]),
    parseFormData,
    OfferCarController.createOfferCar,
  )
  .get('/', auth(USER_ROLE.private_user), OfferCarController.getOfferCarList)
  .patch(
    '/action',
    auth(USER_ROLE.private_user),
    OfferCarController.offerCarAction,
  );

export const OfferCarRoutes = router;
