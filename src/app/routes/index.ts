import express from 'express';
import { UserRoutes } from '../modules/user/users.routes';
import { UserAuth } from '../modules/auth/auth.route';
import { CowsRoutes } from '../modules/cow/cows.routes';
import { OrderRoutes } from '../modules/order/order.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: UserAuth,
  },
  {
    path: '/cows',
    route: CowsRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
