import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { SaleCarController } from './saleCar.controller';

const router = Router();

router.patch(
  '/update_contact_paper/:carId',
  auth(USER_ROLE.private_user, USER_ROLE.dealer),
  SaleCarController.updateContactPaper,
);

export const SaleCarRoutes = router;
