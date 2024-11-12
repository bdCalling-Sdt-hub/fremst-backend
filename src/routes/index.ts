import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CustomerRoutes } from '../app/modules/customer/customer.route';
import { ProductRoutes } from '../app/modules/product/product.route';
import { QuestionRoutes } from '../app/modules/question/question.route';
import { QuestionCategoryRoutes } from '../app/modules/questionCategory/questionCategory.route';
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
    path: '/question/category',
    route: QuestionCategoryRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
