import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { OfferCarController } from './offerCar.controller';
import parseFormData from '../../middleware/parsedData';
import fileUpload from '../../utils/uploadImage';

const upload = fileUpload('./public/uploads/images/');

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
  .get(
    '/my_list',
    auth(USER_ROLE.private_user, USER_ROLE.dealer),
    OfferCarController.myOfferCarList,
  )
  .get('/every_offer_contact', OfferCarController.getEveryOfferContact)
  .patch(
    '/action',
    auth(USER_ROLE.private_user),
    OfferCarController.offerCarAction,
  )
  .patch(
    '/update_offer_car/:offerCarId',
    auth(USER_ROLE.dealer, USER_ROLE.private_user),
    upload.fields([
      { name: 'signatureAsOwner', maxCount: 2 },
      { name: 'signatureAsDealer', maxCount: 2 },
    ]),
    parseFormData,
    OfferCarController.updateOfferCarContactPaper,
  );

export const OfferCarRoutes = router;
