import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CustomerRoutes } from '../app/modules/customer/customer.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/customer',
    route: CustomerRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
