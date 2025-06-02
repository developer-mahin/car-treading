import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { SaleCarController } from './saleCar.controller';
import parseFormData from '../../middleware/parsedData';
import fileUpload from '../../utils/uploadImage';

const upload = fileUpload('./public/uploads/images/');

const router = Router();

router
  .patch(
    '/update_contact_paper/:saleCarId',
    auth(USER_ROLE.private_user, USER_ROLE.dealer),
    upload.fields([
      { name: 'signatureAsOwner', maxCount: 2 },
      { name: 'signatureAsDealer', maxCount: 2 },
    ]),
    parseFormData,
    SaleCarController.updateContactPaper,
  )
  .get(
    '/',
    auth(USER_ROLE.private_user, USER_ROLE.dealer, USER_ROLE.admin),
    SaleCarController.getSaleCarList,
  )
  .get('/all_car_list', auth(USER_ROLE.admin), SaleCarController.allCarList)
  .get(
    '/total_sales_chart',
    auth(USER_ROLE.admin),
    SaleCarController.getTotalSalesChart,
  )
  .patch('/action', auth(USER_ROLE.admin), SaleCarController.saleCarAction);

export const SaleCarRoutes = router;
