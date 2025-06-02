import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { OrderTransportController } from './orderTransport.controller';

const router = Router();

router
  .post(
    '/create',
    auth(USER_ROLE.dealer),
    OrderTransportController.createOrderTransport,
  )
  .get(
    '/',
    auth(USER_ROLE.dealer),
    OrderTransportController.getAllOrderTransports,
  );

export const OrderTransportRoutes = router;
