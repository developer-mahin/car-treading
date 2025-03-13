import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { ProfileRoutes } from '../modules/profile/profile.routes';
import { RestaurantRoutes } from '../modules/restaurant/restaurant.routes';
import { StaticContentRoutes } from '../modules/staticContent/staticContent.routes';
import { FeedbackRoutes } from '../modules/feedback/feedback.routes';
import { QueryRoutes } from '../modules/query/query.routes';
import { ConversationRoutes } from '../modules/conversation/conversation.routes';
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
    path: '/restaurant',
    route: RestaurantRoutes,
  },
  {
    path: '/static_content',
    route: StaticContentRoutes,
  },
  {
    path: '/feedback',
    route: FeedbackRoutes,
  },
  {
    path: '/query',
    route: QueryRoutes,
  },
  {
    path: '/conversation',
    route: ConversationRoutes,
  },
];

routes.forEach((item) => {
  router.use(item.path, item.route);
});

export default router;
