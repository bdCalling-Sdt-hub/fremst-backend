import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CustomerRoutes } from '../app/modules/customer/customer.route';
import { ProductRoutes } from '../app/modules/product/product.route';
import { QuestionRoutes } from '../app/modules/question/question.route';
import { StepRoutes } from '../app/modules/step/step.route';
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
  {
    path: '/question',
    route: QuestionRoutes,
  },
  {
    path: '/question/steps',
    route: StepRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
