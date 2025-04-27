import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { SaleCarController } from './saleCar.controller';
import upload from '../../utils/uploadImage';
import parseFormData from '../../middleware/parsedData';

const router = Router();

router.patch(
  '/update_contact_paper/:saleCarId',
  auth(USER_ROLE.private_user, USER_ROLE.dealer),
  upload.fields([
    { name: 'signatureAsOwner', maxCount: 2 },
    { name: 'signatureAsDealer', maxCount: 2 },
  ]),
  parseFormData,
  SaleCarController.updateContactPaper,
);

export const SaleCarRoutes = router;
