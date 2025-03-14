import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { ConversationRoutes } from '../modules/conversation/conversation.routes';
import { ProfileRoutes } from '../modules/profile/profile.routes';
import { StaticContentRoutes } from '../modules/staticContent/staticContent.routes';
import { UserRoutes } from '../modules/user/user.routes';
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
    path: '/conversation',
    route: ConversationRoutes,
  },
];

routes.forEach((item) => {
  router.use(item.path, item.route);
});

export default router;
