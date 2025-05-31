import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { BidRoutes } from '../modules/bid/bid.routes';
import { CarRoutes } from '../modules/car/car.routes';
import { ConversationRoutes } from '../modules/conversation/conversation.routes';
import { MessageRoutes } from '../modules/message/message.routes';
import { OfferCarRoutes } from '../modules/offerCar/offerCar.routes';
import { OrderTransportRoutes } from '../modules/orderTransport/orderTransport.routes';
import { ProfileRoutes } from '../modules/profile/profile.routes';
import { SaleCarRoutes } from '../modules/saleCar/saleCar.routes';
import { StaticContentRoutes } from '../modules/staticContent/staticContent.routes';
import { SubmitListingRoutes } from '../modules/submitListing/submitListing.routes';
import { TaskRoutes } from '../modules/task/task.routes';
import { TaskResolveRoutes } from '../modules/taskResolve/taskResolve.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { NotificationRoutes } from '../modules/notification/notification.routes';
const router = Router();

type TRoutes = {
  path: string;
  route: Router;
};

const routes: TRoutes[] = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },

  {
    path: '/static_content',
    route: StaticContentRoutes,
  },

  {
    path: '/task',
    route: TaskRoutes,
  },

  {
    path: '/task_resolve',
    route: TaskResolveRoutes,
  },

  {
    path: '/conversation',
    route: ConversationRoutes,
  },

  {
    path: '/car',
    route: CarRoutes,
  },

  {
    path: '/sell_car',
    route: SaleCarRoutes,
  },

  {
    path: '/submit_listing',
    route: SubmitListingRoutes,
  },

  {
    path: '/offer_car',
    route: OfferCarRoutes,
  },

  {
    path: '/bid',
    route: BidRoutes,
  },

  {
    path: '/message',
    route: MessageRoutes,
  },
  {
    path: '/notification',
    route: NotificationRoutes,
  },
  {
    path: '/order_transport',
    route: OrderTransportRoutes,
  },
];

routes.forEach((item) => {
  router.use(item.path, item.route);
});

export default router;
